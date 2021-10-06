# Lecturely-Meet

You must have attended many online classes by now and suffered from attention issues and distractions. What if a Website
can help you in focusing on your online lectures? What if a Website makes attending the online lecture fun, competitive,
and more interactive. Are you pumped up? I will create a script/extension through which lecturers can ask questions
during the meeting and It will make attending lectures a fun game. It will show the scoreboard of how much someone was
focused. Focus on your online lectures to be on top and flex!

# What it offers?

Aim with lecturely-meet was to stimulate a real classroom as much as I can.

It offers circles that shows randomly between 1min to 2min, The faster you click on the circle the more score you get.
This tries to solve the problem of low attention and easy distraction, Everyone can see your score, so It encourages
students to stay in meet tab!

It offers Interactive Questions which can be created by admin(teacher).
It tries to cope with non-interactive meet lectures to fun interactive lectures.
This question will be shown to all the users(except the one created it) and everyone's answer to the question will be
shown to the admin.

It offers private messages between users.
It tries to clone the random chatting we have with benchmates during the class. (memories we create!)


It offers scores of the users.
Just to add a bit of compeitiion, all users score will be visible to everyone (be sure to ace the list!)

# Screenshots

![image](https://user-images.githubusercontent.com/42430171/111056181-1f9f4780-84a3-11eb-8ea8-a3942df24cf7.png)
![image](https://user-images.githubusercontent.com/42430171/111056197-380f6200-84a3-11eb-9eef-0f06b0a46b69.png)
![image](https://user-images.githubusercontent.com/42430171/111056206-42316080-84a3-11eb-8cd0-d1c13735d0d1.png)
![image](https://user-images.githubusercontent.com/42430171/111056217-58d7b780-84a3-11eb-9cbf-0a7c1efc8901.png)
![image](https://user-images.githubusercontent.com/42430171/111056222-63924c80-84a3-11eb-960d-01be47960c87.png)
![image](https://user-images.githubusercontent.com/42430171/111056229-6db44b00-84a3-11eb-9557-dba8f60a520b.png)
![image](https://user-images.githubusercontent.com/42430171/111056231-760c8600-84a3-11eb-84e7-c7e42a37363b.png)
![image](https://user-images.githubusercontent.com/42430171/111056235-7d339400-84a3-11eb-96d2-976b52150e8d.png)
![image](https://user-images.githubusercontent.com/42430171/111056240-83c20b80-84a3-11eb-95bd-721b122cd307.png)
![image](https://user-images.githubusercontent.com/42430171/111056250-8ae91980-84a3-11eb-86df-b7427f26a266.png)
![image](https://user-images.githubusercontent.com/42430171/111056296-ea472980-84a3-11eb-888f-9cbe244403be.png)
![image](https://user-images.githubusercontent.com/42430171/111056312-0d71d900-84a4-11eb-8e0b-25b62be4f8ec.png)
![image](https://user-images.githubusercontent.com/42430171/111056318-19f63180-84a4-11eb-93a5-826b4c2168dd.png)
![image](https://user-images.githubusercontent.com/42430171/111056322-25e1f380-84a4-11eb-9400-0b412098271b.png)

# Video 
https://www.youtube.com/watch?v=RSh_LxoNoSQ


# How everything works?
It uses Node.js sever with express and socket.io.

![image](https://user-images.githubusercontent.com/42430171/111056362-9b4dc400-84a4-11eb-91df-e4f695089e8c.png)

There will be multiple rooms, each room represents a google meet.
There will be only one admin per room (first person to join the google meet).
Every communication between client-server happens with socket.io emits.

At client side there is a chrome extension (bookmarklet didn't work :-()
It automatically detects if you are in a meet and connects to the server!

# Challenges I ran into
I started by trying to make a bookmarklet but quicly ran into csp error! And there is not solution ot it, so, I converted to chrome extension. I had never made a chrome extension before, so this was surely fun. Then I ran into socket.io issues which also I never used before but at-last I was able to solve them all!.

# Technologies I used
JavaScript, Socket.IO, Nodejs, Chrome Extension

# TODO
1. ~~Check if same socket id if client refersh.~~

2. ~~add circleres, message, questionCreated, questionAnswered function to controller and respective functions in
   room.~~
3. ~~Figure out how to show UI to user on top of google meet.~~
4. ~~first user that creates room in a meet becomes admin.~~
5. ~~admin will only able to create questions.~~
6. ~~create a frontend website to add script to bookmarklet.~~
7. ~~redesign ui.~~
8. ~~Make PPT.~~
9. ~~Make video.~~
10. ~~Submit!!~~
11. ~~Have fun!~~
