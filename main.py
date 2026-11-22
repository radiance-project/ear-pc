import eel
import eel.browsers
import sys
import bluetooth
import sqlite3
import threading
import struct
import os
import requests

con = sqlite3.connect("devicesndpreferences.db")

addr = None
sock = None
operationID = 1;
operationList = {}
stopReceiving = False
modelIDGlobalRef = ""
macAddress = ""

def print(text):
    pass

@eel.expose 
def updatePage():
    #check is sock is closed
    if sock is not None:
        eel.toggleConnectionOverlay(False, modelIDGlobalRef, False)

def searchDevicesAndGetFastPair():
    global sock
    if len(sys.argv) < 2:
        print("No device specified. Searching all nearby bluetooth devices for mac addresses starting with '2C:BE'...")
    else:
        addr = sys.argv[1]
        print("Searching for mac addresses starting with '2C:BE' on {}...".format(addr))

    # search for nearby devices
    nearby_devices = bluetooth.discover_devices(lookup_names=True)

    # filter devices by mac address
    target_devices = [device for device in nearby_devices if device[0].startswith("2C:BE")]
    #filter connected devices
    target_devices = [device for device in target_devices if device[1] != ""]

    if len(target_devices) == 0:
        print("Couldn't find any devices with mac addresses starting with '2C:BE'.")
        sys.exit(0)

    print("Found the following devices:")
    for device in target_devices:
        print("Name: {}\tAddress: {}".format(device[1], device[0]))

    for device in target_devices:
        sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
        #uuid = "aeac4a03-dff5-498f-843a-34487cf133eb"
        uuid = "df21fe2c-2515-4fdb-8886-f12c4d67927c"
        service_matches = bluetooth.find_service(uuid=uuid, address=device[0])
        if len(service_matches) == 0:
            print("Couldn't find the service.")
            continue
            
    
        first_match = service_matches[0]
        port = first_match["port"]
        name = first_match["name"]
        host = first_match["host"]
    
        print("Connecting to \"{}\" on {}".format(name, host))
    
    
        sock.connect((host, port))
        print("Connected. Reading data...")
    
        print("true")
        data = sock.recv(1024)
        #hex string without byte format
        data = bytearray.fromhex(data.hex())
        print(data)
        #model need to be like AABBCC (bytes 4 -6)
        model = data[4:7].hex()
        #print full details, name, mac and model
        print("Name: {}\tAddress: {}\tModel: {}".format(device[1], device[0], model))
        #insert into db if mac doesn't already exist
        cur = con.cursor()
        cur.execute("SELECT * FROM devices WHERE mac = ?", (device[0],))
        if cur.fetchone() is None:
            cur.execute("INSERT INTO devices (name, mac, model) VALUES (?, ?, ?)", (device[1], device[0], model))
            con.commit()
        else:
            print("Device already exists")
        sock.close()
        sock = None
    return True
        
@eel.expose
def connectToDevice(mac):
    global sock, stopReceiving, macAddress
    stopReceiving = False
    if sock is not None:
        sock.close()
    print("connectToDevice called")
    sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
    uuid = "aeac4a03-dff5-498f-843a-34487cf133eb"
    service_matches = bluetooth.find_service(uuid=uuid, address=mac)
    if len(service_matches) == 0:
        print("Couldn't find the service.")
        #eel.showErrorPopup("Couldn't connect to device ")
        return False
    macAddress = mac
    
    first_match = service_matches[0]
    port = first_match["port"]
    name = first_match["name"]
    host = first_match["host"]
    
    print("Connecting to \"{}\" on {}".format(name, host))
    
    try:
        sock.connect((host, port))
    except:
        print("Could not connect to device")
        #eel.showErrorPopup("Couldn't connect to device ")
        return False
    print("Connected. Reading data...")
    #get modelID from MAC address
    cur = con.cursor()
    cur.execute("SELECT model FROM devices WHERE mac = ?", (sock.getpeername()[0],))
    modelID = cur.fetchone()[0]
    eel.toggleConnectionOverlay(False, modelID, False)
    #create thread
    receiveDataThread = threading.Thread(target=receiveData, args=(modelID,))
    #start the thread
    receiveDataThread.start()
    return True

def get_command(header):
    command_bytes = bytes(header[3:5])
    command_int = int.from_bytes(command_bytes, byteorder='little')
    return command_int

#function to fecth devices in db and send name and modelID to getDevicesForList
@eel.expose
def fetchDevicesinDB():
    cur = con.cursor()
    cur.execute("SELECT * FROM devices")
    rows = cur.fetchall()
    eel.getDevicesForList(rows)

@eel.expose
def initData():
    functionalities = eel.getModelInfo(modelIDGlobalRef)()
    sendBattery()
    if modelIDGlobalRef == "dee8c0" or modelIDGlobalRef == "acc520":
        getPersonalizedANCStatus()
    if functionalities['isANC']:
        sendANCread()
    sendInEarRead()
    sendLatencyModeRead()
    getEQ()
    getFirmware()
    getDeviceMac()
    sendGetGesture()
    eel.updateBudsInfo(modelIDGlobalRef)


def send(command, payload = [], operation=""):
    header = [0x55, 0x60, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]
    global operationID
    operationID += 1
    header[7] = operationID
    header[3], header[4] = command.to_bytes(2, 'little')
    payloadLength = len(payload)
    header[5] = payloadLength
    header += payload
    bytearray = header
    crc = crc16(bytearray)
    bytearray += [crc & 0xFF, crc >> 8]
    bytearray = bytes(bytearray)
    if operation != "":
        operationList[operationID] = operation
    print("sending " + bytearray.hex())
    sock.send(bytearray)

def isLocalhostActive():
    try:
        requests.get("http://localhost:17079")
    except:
        return False

    return True

def receiveData(modelID):
    global sock, stopReceiving, modelIDGlobalRef
    print("reveiveData called")
    modelIDGlobalRef = modelID
    sock.setblocking(False)
    while isLocalhostActive():
        try:
            eel.sleep(0.1)
            try :
                data = sock.recv(1024)
            except:
                data = None
                continue
            #if data is empty, get back to the loop
            if data:
                print("good")
            else:
                print("error")
            #hex string without byte format
            print("received " + data.hex())
            data = bytearray(data)
            target_size = data[5] + 8
            #print estimated vs actual
            print("estimated size " + str(target_size) + " actual size " + str(len(data)))
            splitted_payload = 0
            splitted_dico = {}
            while len(data) > 2:
                #check at data[target_size] if 0x55
                if data[0] == 0x55:
                    splitted_payload = splitted_payload + 1
                    target_size = data[5] + 8
                    if data[3] == 0x0e and data[4] == 0x40:
                        if modelID == "624011" or modelID == "31d53d":
                            target_size = target_size + 5
                    if data[1] == 0x60:
                        if modelID == "1016dd" or modelID == "dee8c0" or modelID == "acc520":
                            target_size = target_size + 2
                        print("estimated size " + str(target_size))
                        splitted_dico[splitted_payload] = data[:(target_size)]
                        data = data[(target_size):]
                    else :
                        splitted_dico[splitted_payload] = data[:target_size]
                        data = data[target_size:]
                else:
                    print("should we handle?")
                    print(data.hex())
                    break
                    
                print("data left " + str(len(data)))
            print("splitted payload " + str(splitted_payload))
            #print all hex payload
            for i in range(1, splitted_payload+1):
                print("payload " + str(i) + " " + splitted_dico[i].hex())
                print("received OPID " + str(splitted_dico[i][7]))
                if splitted_dico[i][7] in operationList:
                    if operationList[splitted_dico[i][7]] == "readBattery":
                        print("ok")
                        readBattery(splitted_dico[i].hex())
                    if operationList[splitted_dico[i][7]] == "readANC":
                        print("ok")
                        readANC(splitted_dico[i].hex())
                    if operationList[splitted_dico[i][7]] == "readInEar":
                        print("ok")
                        readInEar(splitted_dico[i].hex())
                    if operationList[splitted_dico[i][7]] == "readLatency":
                        print("ok")
                        readLatency(splitted_dico[i].hex())
                    if operationList[splitted_dico[i][7]] == "readEQ":
                        print("ok")
                        readEQ(splitted_dico[i].hex())
                    if operationList[splitted_dico[i][7]] == "readFirmware":
                        print("ok")
                        readFirmware(splitted_dico[i].hex())
                    if operationList[splitted_dico[i][7]] == "getGesture":
                        print("ok")
                        readGesture(splitted_dico[i].hex())
                    if operationList[splitted_dico[i][7]] == "readCustomEQ":
                        print("ok")
                        readCustomEQ(splitted_dico[i].hex())
                    if operationList[splitted_dico[i][7]] == "readPersonalizedANC":
                        print("ok")
                        readPersonalizedANC(splitted_dico[i].hex())
                    if operationList[splitted_dico[i][7]] == "readLEDCaseColor":
                        print("ok")
                        readLEDCaseColor(splitted_dico[i].hex())
                command = get_command(splitted_dico[i])
                if command == 57345:
                    readBattery(splitted_dico[i].hex())
                if command == 57347:
                    readANC(splitted_dico[i].hex())
                if command == 16416:
                    readPersonalizedANC(splitted_dico[i].hex())
                if command == 16452:
                    readCustomEQ(splitted_dico[i].hex())
                if command == 16408:
                    readGesture(splitted_dico[i].hex())
                if command == 16398:
                    readInEar(splitted_dico[i].hex())
                if command == 16449:
                    readLatency(splitted_dico[i].hex())
                if command == 57357:
                    readEarFitTestResult(splitted_dico[i].hex())
                if command == 16415:
                    readEQ(splitted_dico[i].hex())
                
            global operationID
            if operationID >= 250:
                operationID = 1
                operationList.clear()
        except Exception as e:
            sock.close()
            break
    sock.close()
    sock = None
    eel.toggleConnectionOverlay(True, "", False)
#function to send devices list to js
@eel.expose
def getDevices():
    print("getDevices called")
    return searchDevicesAndGetFastPair()

@eel.expose
def stopReceivingData():
    global stopReceiving
    stopReceiving = True


@eel.expose 
def ringBuds(isRing, isLeft = False):
    bytearray = []
    if modelIDGlobalRef == "624011" or modelIDGlobalRef == "31d53d":
        #build payload from 0x 55 60 01 02 f0 01 00 1b 01 + CRC16[2]
        if isRing:
            bytearray.append(0x01)
        else:
            bytearray.append(0x00)
        send(61442, bytearray)
    elif modelIDGlobalRef == "1016dd" or modelIDGlobalRef == "dee8c0" or modelIDGlobalRef == "acc520":
        bytearray = [0x00, 0x00]
        if isLeft:
            bytearray[0] = 0x02
        else :
            bytearray[0] = 0x03
        if isRing:
            bytearray[1] = 0x01
        send(61442, bytearray)
        
            
        
def getDeviceMac():
    global macAddress
    eel.setMacAdressText(macAddress)
    
 
@eel.expose
def getFirmware():
    send(49218, [], "readFirmware")
    
def readFirmware(hexstring):
    firmwareVersion = ""
    hexstring = bytearray.fromhex(hexstring)
    size = hexstring[5]
    for i in range(0, size):
        firmwareVersion = firmwareVersion + chr(hexstring[8+i])
    eel.setFirmwareText(firmwareVersion)

@eel.expose
def getEQ():
    send(49183, [], "readEQ")
            
def readEQ(hexString):
    print("readEQ called")
    hexString = bytearray.fromhex(hexString)
    eqMode = hexString[8]
    print("eqMode " + str(eqMode))
    eel.setEQfromRead(eqMode)
        
@eel.expose
def setEQ(level):
    bytearray = [0x00, 0x00]
    bytearray[0] = level
    send(61456, bytearray, "setEQ")

def formatFloatForEQ(f, total):
    array = struct.pack('>f', f)
    array = bytearray(array)
    if f != 0.0 and array[0] == 0 and array[1] == 0 and array[2] == 0:
        array[3] = (array[3] | 0x80) & 0xff
    for i in range(len(array) // 2):
        j = len(array) - i - 1
        array[i], array[j] = array[j], array[i]
    if total:
        if f >= 0:
            array = bytearray([0x00, 0x00, 0x00, 0x80])
    return array

@eel.expose 
def setCustomEQ(level):
    if modelIDGlobalRef == "1016dd" or modelIDGlobalRef == "dee8c0" or modelIDGlobalRef == "acc520":
        bytearray = [0x03, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x75, 0x44, 0xc3, 0xf5, 0x28, 0x3f, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc0, 0x5a, 0x45, 0x00, 0x00, 0x80, 0x3f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x43, 0xcd, 0xcc, 0x4c, 0x3f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        #get the highest value in the array
        highestValue = 0
        for i in range(0, 3):
            if level[i] > highestValue:
                highestValue = level[i]
        highestValue = highestValue / -1
        array = formatFloatForEQ(highestValue, True)
        for j in range(0, 4):
            bytearray[1 + j] = array[j]
        for i in range(0, 3):
            array = formatFloatForEQ(level[i], False)
            for j in range(0, 4):
                bytearray[6 + (i * 13) + j] = array[j]
        send(61505, bytearray, "setCustomEQ")

@eel.expose
def getCustomEQ():
    if modelIDGlobalRef == "1016dd" or modelIDGlobalRef == "dee8c0" or modelIDGlobalRef == "acc520":
        send(49220, [], "readCustomEQ")

def fromFormatFloatForEQ(array):
    for i in range(len(array) // 2):
        j = len(array) - i - 1
        array[i], array[j] = array[j], array[i]
    if array[0] == 0 and array[1] == 0 and array[2] == 0 and array[3] & 0x80:
        array[3] = array[3] & 0x7f
        f = struct.unpack('>f', bytes(array))[0]
        return -f
    else:
        return struct.unpack('>f', bytes(array))[0]

def readCustomEQ(hexString):
    print("readCustomEQ called")
    if modelIDGlobalRef == "1016dd" or modelIDGlobalRef == "dee8c0" or modelIDGlobalRef == "acc520":
        hexString = bytearray.fromhex(hexString)
        print(hexString)
        level = []
        for i in range(0, 3):
            array = []
            for j in range(0, 4):
                array.append(hexString[14 + (i * 13) + j])
            level.append(fromFormatFloatForEQ(array))
        for element in level:
            print((element))
        formatedArray = [level[2], level[0], level[1]] 
        eel.setCustomEQ(formatedArray)


@eel.expose
def getLEDCaseColor():
    if modelIDGlobalRef == "624011" or modelIDGlobalRef == "31d53d":
        send(49175, [], "readLEDCaseColor")

def readLEDCaseColor(hexString):
    if modelIDGlobalRef == "624011" or modelIDGlobalRef == "31d53d":
        print("readLEDCaseColor called")
        hexString = bytearray.fromhex(hexString)
        numberOfLed = hexString[8]
        print(hexString.hex())
        #high = 2, mid = 1, low = 0
        #charged = 4, charging = 3
        #led value start at 9 and is like (led number, red, green, blue))
        ledArray = []
        for i in range(0, numberOfLed):
            ledArray.append([hexString[10 + (i * 4)], hexString[11 + (i * 4)], hexString[12 + (i * 4)]])
        #build array like #RRGGBB, #RRGGBB, #RRGGBB
        ledArrayString = []
        for led in ledArray:
            ledArrayString.append("#" + ''.join(format(x, '02x') for x in led))
        eel.getCaseColor([ledArrayString[2], ledArrayString[1], ledArrayString[0], ledArrayString[3], ledArrayString[4]])

@eel.expose
def sendLEDCaseColor(colorArray):
    print("sendLEDCaseColor called")
    print(colorArray)
    if modelIDGlobalRef == "624011" or modelIDGlobalRef == "31d53d":
        bytearray = [0x05, 0x01, 0xff, 0xff, 0xff, 0x02, 0xff, 0xff, 0xff, 0x03, 0xff, 0xff, 0xff, 0x04, 0xff, 0xff, 0xff, 0x05, 0xff, 0xff, 0xff]
        for i in range(0, 5):
            for j in range(0, 3):
                bytearray[2 + (i * 4) + j] = colorArray[i][j]
        send(61453, bytearray)



@eel.expose
def sendBattery():
    send(49159, [], "readBattery")

def readBattery(hexString):
    connectedDevices = 0
    batteryStatus = {"left": "DISCONNECTED", "right": "DISCONNECTED", "case": "DISCONNECTED"}
    deviceIdToKey = {0x02: "left", 0x03: "right", 0x04: "case"}
    BATTERY_MASK = 127
    RECHARGING_MASK = 128

    hexString = bytearray.fromhex(hexString)
    
    connectedDevices = hexString[8]
    for i in range(connectedDevices):
        deviceId = hexString[9 + (i * 2)]
        key = deviceIdToKey.get(deviceId, "unknown")
        batteryLevel = hexString[10 + (i * 2)] & BATTERY_MASK
        isCharging = (hexString[10 + (i * 2)] & RECHARGING_MASK) == RECHARGING_MASK
        batteryStatus[key] = batteryLevel
        #batteryStatus[key] = str(batteryLevel) + "%" + (" ⚡" if isCharging else "")
    batteryLeft = batteryStatus["left"]
    batteryRight = batteryStatus["right"]
    batteryCase = batteryStatus["case"]
    eel.setBattery("l", batteryLeft)
    eel.setBattery("r", batteryRight)
    eel.setBattery("c", batteryCase)
    
@eel.expose 
def launchEarFitTest():
    if modelIDGlobalRef == "dee8c0" or modelIDGlobalRef == "acc520":
        send(61460, [0x01])

def readEarFitTestResult(hexstring):
    hexstring = bytearray.fromhex(hexstring)
    LeftearFitTestResult = hexstring[8]
    RightearFitTestResult = hexstring[9]
    eel.earTipStateStatus(LeftearFitTestResult, RightearFitTestResult)

@eel.expose
def sendANCread():
    send(49182, [], "readANC")

def readANC(hexString):
    print("readANC called")
    hexString = bytearray.fromhex(hexString)
    ancStatus = hexString[9]
    level = 0
    if ancStatus == 5:
        level = 1
    elif ancStatus == 7:
        level = 2
    elif ancStatus == 3:
        level = 3
    elif ancStatus == 1:
        level = 4
    elif ancStatus == 2:
        level = 5
    elif ancStatus == 4:
        level = 6
    eel.setANCStatus(level)

@eel.expose
def setANCDisplay(level):
    if level == 1:
        eel.setANCStatus(1)
    elif level == 2:
        eel.setANCStatus(2)
    elif level == 3:
        eel.setANCStatus(3)
    elif level == 4:
        eel.setANCStatus(4)
    elif level == 5:
        eel.setANCStatus(5)
    elif level == 6:
        eel.setANCStatus(6)
    
@eel.expose
def setANC(level):
    bytearray = [0x01, 0x01, 0x00]
    if level == 1:
        bytearray[1] = 0x05
    elif level == 2:
        bytearray[1] = 0x07
    elif level == 3:
        bytearray[1] = 0x03
    elif level == 4:
        bytearray[1] = 0x01
    elif level == 5:
        bytearray[1] = 0x02
    elif level == 6:
        bytearray[1] = 0x04
    send(61455, bytearray, "setANC")

def sendInEarRead():
    send(49166, [], "readInEar")
    
def sendLatencyModeRead():
    send(49217, [], "readLatency")
    
def readInEar(hexString):
    print("readInEar called")
    hexString = bytearray.fromhex(hexString)
    inEarStatus = hexString[10]
    eel.setInEarCheckbox(inEarStatus)
    
def readLatency(hexString):
    print("readLatency called")
    hexString = bytearray.fromhex(hexString)
    latencyStatus = hexString[8]
    eel.setLatencyModeCheckbox(latencyStatus)
    
@eel.expose
def setInEar(status):
    bytearray = [0x01, 0x01, 0x00]
    if status == 1:
        bytearray[2] = 0x01
    elif status == 0:
        bytearray[2] = 0x00
    send(61444, bytearray)
    
@eel.expose
def setLatency(status):
    bytearray = [0x02, 0x00]
    if status == 1:
        bytearray[0] = 0x01
    elif status == 0:
        bytearray[0] = 0x02
    send(61504, bytearray)
    
@eel.expose
def getPersonalizedANCStatus():
    if modelIDGlobalRef == "dee8c0":
        send(49184, [], "readPersonalizedANC")

def readPersonalizedANC(hexString):
    hexString = bytearray.fromhex(hexString)
    personalizedANCStatus = hexString[8]
    eel.setPersonalAncCheckbox(personalizedANCStatus)

@eel.expose
def setPersonalizedANC(enabled):
    if modelIDGlobalRef == "dee8c0":
        bytearray = [0x00]
        if enabled == 1:
            eel.setPersonalAncCheckbox(1)
            bytearray[0] = 0x01
        else:
            eel.setPersonalAncCheckbox(0)
        send(61457, bytearray, "")

@eel.expose
def sendGetGesture():
    send(49176, [], "getGesture")

def readGesture(hexString):
    print("readGesture called")
    hexString = bytearray.fromhex(hexString)
    #print hexString as text
    print(hexString.hex())
    gestureCount = hexString[8]
    #build 4 bytes packet for each gesture using json
    gestureArray = []
    for i in range(gestureCount):
        gesture = {}
        gesture["gestureDevice"] = hexString[9 + i * 4]
        gesture["gestureCommon"] = hexString[10 + i * 4]
        gesture["gestureType"] = hexString[11 + i * 4]
        gesture["gestureAction"] = hexString[12 + i * 4]
        gestureArray.append(gesture)
    print(gestureArray)
    eel.updateGesturesFromArray(gestureArray)

@eel.expose
def sendGestures(device, typeog, action):
    bytearray = [0x01, 0x02, 0x01, 0x03, 0x0b]
    bytearray[1] = int(device)
    bytearray[3] = int(typeog)
    bytearray[4] = int(action)
    send(61443, bytearray)
    
@eel.expose
def crc16(hexbytearray):
    crc = 0xFFFF
    for i in range(len(hexbytearray)):
        crc ^= hexbytearray[i]
        for j in range(8):
            if (crc & 0x0001) != 0:
                crc >>= 1
                crc ^= 0xA001
            else:
                crc >>= 1
    return crc
#init db if not ready, create table for device with (id autoincrement, name, mac, model) and prefrences with (id autoincrement, deviceID and gesture array) db is con
def initDB():
    global con
    cur = con.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS devices (id INTEGER PRIMARY KEY AUTOINCREMENT, mac TEXT, name TEXT, model TEXT)")
    cur.execute("CREATE TABLE IF NOT EXISTS preferences (id INTEGER PRIMARY KEY AUTOINCREMENT, deviceID INTEGER, gestureArray TEXT)")
    con.commit()
    

def main():
    initDB()
    eel.init('res')
    eel.browsers.set_path('electron', 'electron/electron')
    try:
        eel.start("./MainControl/MainControl_nothing_connected.html", mode="electron", port=17079)
    except Exception as e:
        print(e)
        os.system("electron/electron")
        sys.exit(0)

if __name__ == "__main__":
    main()