# ear (PC) [unofficial]

![Ear(PC) Logo](icons/png/256x256.png)


Hi! This is the repo for our unofficial port of Nothing X to PC.
This Github repo only includes the frontend part for everyone to contribute. The backend is kept private for the moment, more on that in our faq.


# Install
1. Make sure you have a Windows computer running at least Windows 10.
2. Download the ``launcher.exe`` file from the latest release [here](https://github.com/radiance-project/ear-pc/releases)
3. Run the installer and let it download all the components (the installer will allow you to update the app later)
4. Launch the app and enjoy!

If you want to contribute, we recommend cloning the repo using
```git clone https://github.com/radiance-project/ear-pc.git```

You can build your dev environment this way:
1. Install Python 3.10.0 from [here] (https://www.python.org/downloads/release/python-3100/)
2. Install Pybluez using ``python -m pip install -e git+https://github.com/pybluez/pybluez.git#egg=pybluez ``
3. Create a folder to store the project.
3. Get the electron.zip file from the latest version and extract it to the root directory of the folder.
4. Take the frontend files (res folder) and place the folder in the root directory of your folder.
5. Take main.pyc and put it in the root directory of your folder.
6. Run the app using ``python main.pyc`` in the root directory of your folder.

## Features
We offer an app that uses two seperate windows. 
`Main Window:`
 - Battery percentage
 - Equalizer settings with custom Equalizer for Ear (stick) and Ear (2)
 - Quick Settings (In-Ear Detection, Low Latency Mode, Firmware version) and (Ear (2) only) Personalized ANC toggle and Ear Tip Fit Test
 - Gestures
 - Find my Earbuds 
 - Case Battery Status LED (Ear (1) only)
 
 as well as as a `Tray Window`. This window can be launched by clicking on the ear (PC) icon in your taskbar and offers:
  - ANC control (Ear(1) & Ear(2))
  - Battery percentage
  - Personalized ANC (Ear (2) only) 

## FAQ

> Are you planning on bringing this to mac and linux as well?

Mac is already being worked on, but since Pybluez rely on old libraries, some work around the Apple BT API is needed. 
Linux is also coming soon.
We are working on a way to make it work with the installer.

> Why is only the frontend public?

For the security of users, the entire backend is kept private for the moment, a mishandling of these tools could affect the proper functioning of the devices, Nothing(R), or Lisra-git or any other contributor to the project cannot be held responsible in case of mishandling related to a modified use of the project outside of its intended use and safety measures in place. 

> What devices are supported?

Right now, we offer support for
 - ear (1)
 - ear (stick)
 - ear (2)
 
We plan to expand that list if new devices come out.


> How do I contribute?

Easy, just create a new issue or pull request and we will merge your changes after review
<br>
<br>
If you still have questions, don't hesitate to reach out to [RapidZapper](https://discord.com/users/577059129097584640) or [Bendix](https://discord.com/users/462340067864870923) on Discord

## Credits and Acknowledgements
- RapidZapper for the idea and backend work
- [Bendix](https://www.mrbrickstar.de/) for the frontend work 
- [DerrenGoneDigital](https://twitter.com/DerrenDigital) for the logo

## LEGAL

This application and code is published under the GNU General Public License v3.0. (https://github.com/radiance-project/ear-pc/blob/main/LICENSE)

Nothing Technology Limited or any of its affiliates, subsidiaries, or related entities (collectively, “Nothing Technology”) is a valid licensee and can use this app for any purpose, including commercial purposes, without compensation to the developers of this app. Nothing Technology is not required to comply with the terms of the GNU General Public License v3.0.

This app is developed by RapidZapper and Bendix and is not affiliated with, sponsored by, or endorsed by Nothing Technology. The developers of this app take no responsibility for the accuracy or completeness of the content and materials provided in this app. The content and materials contained in this app, including but not limited to text, graphics, logos, images, and audio/visual materials, are proprietary to Nothing Technology Limited, 80 Cheapside, London EC2V 6EE and are protected by copyright, trademark, and other intellectual property laws. These materials may not be used without the express written permission of Nothing Technology. Nothing Technology reserves all rights.
