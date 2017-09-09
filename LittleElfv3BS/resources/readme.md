
//use puttygen in terminal to convert the
// .pem key pair file to a .ppk file.

1. Install putty
>>brew install putty

2. Use puttygen
>>puttygen mykey.pem -o mykey.ppk

Bitnami app password: csxKEuZPmsv7


HOW TO UPLOAD TO AWS

1. Go to AWS and launch a new instance of Bitmani MEAN image (ubuntu)
2. Useful tutorial https://scotch.io/tutorials/deploying-a-mean-app-to-amazon-ec2-part-1

3. Instead of putty, use terminal. Relevant commands are:
ummm ssh -i 'LittleElf.pem' ubuntu@ ....ummm

4. who knows
sudo rm -rf LittleElfWebsite
sudo git clone https://github.com/AlisonWonderlandApps/LittleElfWebsite.git
node
