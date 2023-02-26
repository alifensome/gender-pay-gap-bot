# Update a security group rule allowing your 
# current IPv4 I.P. to connect on port 22 (SSH)

IP=`curl -s http://whatismyip.akamai.com/`
aws ec2 authorize-security-group-ingress --group-name default --protocol tcp --port 22 --cidr $IP/32 --output text
