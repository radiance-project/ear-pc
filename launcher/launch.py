import os
import time
import psutil
import json
import requests
from tqdm import tqdm
import zipfile
import os, winshell
from win32com.client import Dispatch


appdir = os.path.join(os.environ['USERPROFILE'], 'AppData', 'Local', 'Programs', 'ear-pc')


def isInstallComplete():
	if (os.path.exists(appdir)):
		#check if ear-pc.exe exists and electron folder not empty and launcher.exe exists
		if (os.path.exists(os.path.join(appdir, 'ear-pc.exe')) and os.path.exists(os.path.join(appdir, 'electron')) and os.path.exists(os.path.join(appdir, 'version.json'))):
			return True
	return False

def getLatestRelease():
	latest = requests.get("https://api.github.com/repos/radiance-project/ear-pc/releases/latest")
	latest = json.loads(latest.text)
	#get tag
	tag = latest['tag_name']
	return tag

def getLatestVersionJson():
	latest = requests.get("https://api.github.com/repos/radiance-project/ear-pc/releases/latest")
	latest = json.loads(latest.text)
	assets = latest['assets']
	for asset in assets:
		if (asset['name'] == 'version.json'):
			#download asset['browser_download_url']
			version = requests.get(asset['browser_download_url'])
			version = json.loads(version.text)
			return version

def getInstalledVersion():
#check if version.json exists
	if (os.path.exists(os.path.join(appdir, 'version.json'))):
		#read version.json
		with open(os.path.join(appdir, 'version.json')) as f:
			version = json.load(f)
		return version['version']
	else:
		return "0.0.0"

def getBaseAndElectronInstalledVersion():
#check if version.json exists
	if (os.path.exists(os.path.join(appdir, 'version.json'))):
		#read version.json
		with open(os.path.join(appdir, 'version.json')) as f:
			version = json.load(f)
		return version['baseVersion'], version['electronVersion']
	else:
		return "0.0.0", "0.0.0"


def downloadLatestRelease(type):
	latest = requests.get("https://api.github.com/repos/radiance-project/ear-pc/releases/latest")
	latest = json.loads(latest.text)
	assets = latest['assets']
	electronDownloadLink = ""
	baseDownloadLink = ""
	versionDownloadLink = ""
	versionJson = ""
	electronVersion = ""
	baseVersion = ""
	for asset in assets:
		if (asset['name'] == 'electron.zip'):
			electronDownloadLink = asset['browser_download_url']
		elif (asset['name'] == 'ear-pc.exe'):
			baseDownloadLink = asset['browser_download_url']
		elif (asset['name'] == 'version.json'):
			versionDownloadLink = asset['browser_download_url']
	versionJson = requests.get(versionDownloadLink)
	versionJson = json.loads(versionJson.text)
	if type == 'all':
		with open(os.path.join(appdir, 'version.json'), 'w') as f:
			json.dump(versionJson, f)
		downloadLatestRelease('electron')
		downloadLatestRelease('base')
	if type == 'electron':
		#download electron.zip
		print("Downloading Electron")
		r = requests.get(electronDownloadLink, stream=True)
		total_size = int(r.headers.get('content-length'))
		initial_pos = 0
		file = electronDownloadLink.split('/')[-1]
		#if electron.zip exist, delete
		if (os.path.exists(os.path.join(appdir, 'electron.zip'))):
			os.remove(os.path.join(appdir, 'electron.zip'))
		with open(os.path.join(appdir, 'electron.zip'), 'wb') as f:
			with tqdm(total=total_size, unit="B", unit_scale=True, desc=file,initial=initial_pos, ascii=True) as pbar:
				for ch in r.iter_content(chunk_size=1024):                            
					if ch:
						f.write(ch) 
						pbar.update(len(ch))
		time.sleep(1)
		#if folder electron exist, delete
		if (os.path.exists(os.path.join(appdir, 'electron'))):
			os.system("rmdir /S /Q " + os.path.join(appdir, 'electron'))
		print("Extracting Electron")
		with zipfile.ZipFile(os.path.join(appdir, 'electron.zip'), 'r') as zip_ref:
			zip_ref.extractall(appdir)
		if (os.path.exists(os.path.join(appdir, 'electron.zip'))):
			os.remove(os.path.join(appdir, 'electron.zip'))
		#open version.json and update electron version
		with open(os.path.join(appdir, 'version.json'), 'r+') as f:
			currentVersion = json.load(f)
			currentVersion['version'] = versionJson['version']
			currentVersion['electronVersion'] = versionJson['electronVersion']
			f.seek(0)
			f.truncate()
			json.dump(currentVersion, f)
	if type == 'base':
		#download ear-pc.exe
		print("Downloading Ear (PC)")
		r = requests.get(baseDownloadLink, stream=True)
		total_size = int(r.headers.get('content-length'))
		initial_pos = 0
		file = baseDownloadLink.split('/')[-1]
		#if ear-pc.exe exist, delete
		if (os.path.exists(os.path.join(appdir, 'ear-pc.exe'))):
			os.remove(os.path.join(appdir, 'ear-pc.exe'))
		with open(os.path.join(appdir, 'ear-pc.exe'), 'wb') as f:
			with tqdm(total=total_size, unit="B", unit_scale=True, desc=file,initial=initial_pos, ascii=True) as pbar:
				for ch in r.iter_content(chunk_size=1024):                            
					if ch:
						f.write(ch) 
						pbar.update(len(ch))
		#open version.json and update base version
		with open(os.path.join(appdir, 'version.json'), 'r+') as f:
			currentVersion = json.load(f)
			currentVersion['version'] = versionJson['version']
			currentVersion['baseVersion'] = versionJson['baseVersion']
			f.seek(0)
			f.truncate()
			json.dump(currentVersion, f)



def main():
	for proc in psutil.process_iter():
		if ("ear-pc.exe" in proc.name()) or ("Ear (PC)" in proc.name()) or ("electron" in proc.name()):
			proc.kill()
	print('Welcome to Ear (PC) BETA Launcher')
	if (isInstallComplete()):
		print("Checking for updates")
		installed = getInstalledVersion()
		latest = getLatestRelease()
		if (installed == latest):
			print("Ear (PC) is up to date")
			input("Press Enter to exit...")
		elif (installed < latest):
			print("A new update for Ear (PC) is available, the launcher will download the latest version and exit")
			latest = getLatestVersionJson()
			#check if electron and base is up to date
			base, electron = getBaseAndElectronInstalledVersion()
			if (base < latest['baseVersion'] and electron < latest['electronVersion']):
				downloadLatestRelease('all')
			elif (base < latest['baseVersion']):
				downloadLatestRelease('base')
			elif (electron < latest['electronVersion']):
				downloadLatestRelease('electron')
			input("Press Enter to exit...")
	else:
		if not os.path.exists(appdir):
			os.makedirs(appdir)
		print("This is the first install, the launcher will download package required to use Ear(PC)\nThe estimated download size is around 150MB")
		latest = getLatestRelease()
		print("Downloading Ear (PC) version " + latest)
		downloadLatestRelease('all')
		print("Ear (PC) is ready to use")
		#add shortcut to ear-pc.exe to desktop creating lnk
		shell = Dispatch('WScript.Shell')
		shortcut = shell.CreateShortCut(os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop') + '\\Ear (PC).lnk')
		shortcut.Targetpath = os.path.join(appdir, 'ear-pc.exe')
		shortcut.WorkingDirectory = appdir
		shortcut.IconLocation = os.path.join(appdir, 'electron/electron.exe')
		shortcut.save()
		#add shortcut to ear-pc.exe to start menu creating lnk
		shell = Dispatch('WScript.Shell')
		shortcut = shell.CreateShortCut(os.path.join(os.path.join(os.environ['USERPROFILE']), 'AppData/Roaming/Microsoft/Windows/Start Menu/Programs') + '\\Ear (PC).lnk')
		shortcut.Targetpath = os.path.join(appdir, 'ear-pc.exe')
		shortcut.WorkingDirectory = appdir
		shortcut.IconLocation = os.path.join(appdir, 'electron/electron.exe')
		shortcut.save()
		input("Press Enter to exit...")

	
main()