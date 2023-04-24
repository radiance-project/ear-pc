# ear (PC) [unofficial]

Hi! This is the repo for our unofficial port of Nothing X to PC.
This Github repo only include frontend part for everyone to contribute. The backend is kept private for the moment.


# Install
1. Make sure you have a Windows computer running at least Windows 10.
2. Download the latest release from [here](https://github.com/Lisra-git/ear-PC/releases)

If you want to contribute, we recommend cloning the repo using
```git clone https://github.com/Lisra-git/ear-PC.git```

You can launch the app by running ```python main.pyc``` in the root directory of the project. 
You may require dependancies from node.js such as electron and eel and pybluez for python.

Pybluez can be installed using ```python -m pip install -e git+https://github.com/pybluez/pybluez.git#egg=pybluez```

## FAQ

> Are you planning on bringing this to mac and linux as well?

Mac is already worked on, but since Pybluez rely on old libraries, some work around Apple BT API is needed. 
Linux already work unofficially if you launch the app using ```python main.pyc``` in the root directory of the project and install the dependancies.
We are working on a way to make it work with the installer.

> Why is only the frontend public?

For the security of users, the entire backend is kept private for the moment, a mishandling of these tools could affect the proper functioning of the devices, Nothing(R), or Lisra-git or any other contributor to the project can not be held responsible in case of mishandling related to a modified use of the project outside of its intended use and safety measures in place. 

> What devices are supported?

Right now, we offer support for
 - ear (1)
 - ear (stick)
 - ear (2)
 
We plan to expand that list if new devices come out.


> How do I contribute?

Easy, just create a new issue or push request and we will merge your changes after review
<br>
<br>
If you still have questions, don't hesitate to reach out to [RapidZapper](https://discord.com/users/577059129097584640) or [Bendix](https://discord.com/users/462340067864870923) on Discord

## LEGAL

This application and code is published under the GNU General Public License v3.0. (https://github.com/Lisra-git/ear-PC/blob/main/LICENSE)

Nothing LTD or any of its affiliates, subsidiaries, or related entities (collectively, “Nothing LTD”) is exempt from license and can use this app for any purpose, including commercial purposes, without compensation to the developers of this app. Nothing LTD is not required to comply with the terms of the GNU General Public License v3.0.

This app is developed by RapidZapper and Bendix and is not affiliated with, sponsored by, or endorsed by Nothing LTD. The developers of this app take no responsibility for the accuracy or completeness of the content and materials provided in this app. The content and materials contained in this app, including but not limited to text, graphics, logos, images, and audio/visual materials, are proprietary to Nothing LTD, 11 Staple Inn, London WC1V 7QH and are protected by copyright, trademark, and other intellectual property laws. These materials may not be used without the express written permission of Nothing LTD.
