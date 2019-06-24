# Pick--A--News-Project
“Peek-A-News” a news feed exchange system using loose coupling architecture of RESTful methods which is quite flexible and scalable.


# Instruction Manual

Software Requirements
- NodeJs
- MongoDB


# Software Installation

If you already have NodeJs & MongoDB installed & setup, then please skip to Project setup.


Downloads:
- Download & Install NodeJs from the link -  https://nodejs.org/en/download/
- Download & Install MongoDB from the link - https://www.mongodb.com/download-center
- Setup Path for MongoDB (/usr/local/var/mongodb)


# Installation & set-up:

Set-up path for NodeJs and MongoDB application and run MongoDB locally on your computer.
Confirm if your database is running or not. If not.

Execute the following command on Terminal:


    cd /usr/local/var/mongodb       -> Where MongoDB have been installed or Set Path dir

    mongod                          -> Run MongoDB locally on your computer


# Project Setup
1. Unzip the project Source Code. Project Structure could be same as the below picture.
![](https://paper-attachments.dropbox.com/s_0B7AE0B5197E85A063FF3FA106231A4FEF306C224B3F8FB5C6CD72255C15BB31_1530416338279_Screen+Shot+2018-07-01+at+5.37.11+AM.png)



2. In Package.json file, all the dependencies module for the project are mentioned.
3. Install all the dependencies by using console/terminal/command prompt at the project directory. Run the command:

    npm install


4. After successful Installation, you will now see node_modules folder in the project directory.


5. Set up a web server to run our web application project. Run the command from the project directory:

    node server

This would start the local web server available at http://127.0.0.1:3000/ or http://localhost:3000


5. Visit http://localhost:3000. This will load the static Website with no content. It may looks something like this one.


![Static Website with No content.](https://paper-attachments.dropbox.com/s_73A269BCD8E542712ADA0336546A04222BCF234529E38082D67CAFF35899798D_1561308590812_Screenshot+2019-06-23+at+6.49.31+PM.png)



6. Click on reload to Create Database and Initiate inserting predefined RSS Feeds providers that you will be able to see in Providers tab. You can also manually “Insert New Provider” with the tab button.


7. Export into RSS feed is available at http://localhost:3000/feeds/export.
    Only the enabled feed item will be exported.
![Feed Items](https://paper-attachments.dropbox.com/s_73A269BCD8E542712ADA0336546A04222BCF234529E38082D67CAFF35899798D_1561315872239_Screenshot+2019-06-23+at+8.44.36+PM.png)



![Feed Item](https://paper-attachments.dropbox.com/s_73A269BCD8E542712ADA0336546A04222BCF234529E38082D67CAFF35899798D_1561316071921_Screenshot+2019-06-23+at+8.53.57+PM.png)
![Provider Item](https://paper-attachments.dropbox.com/s_73A269BCD8E542712ADA0336546A04222BCF234529E38082D67CAFF35899798D_1561316071910_Screenshot+2019-06-23+at+8.53.42+PM.png)

![Insert New Provider](https://paper-attachments.dropbox.com/s_73A269BCD8E542712ADA0336546A04222BCF234529E38082D67CAFF35899798D_1561316321718_Screenshot+2019-06-23+at+8.57.54+PM.png)

![Update web feed age](https://paper-attachments.dropbox.com/s_73A269BCD8E542712ADA0336546A04222BCF234529E38082D67CAFF35899798D_1561316321735_Screenshot+2019-06-23+at+8.58.14+PM.png)
![Update web feed time interval](https://paper-attachments.dropbox.com/s_73A269BCD8E542712ADA0336546A04222BCF234529E38082D67CAFF35899798D_1561316321727_Screenshot+2019-06-23+at+8.58.06+PM.png)
