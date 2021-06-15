# $Cred = Get-Credential
# $Url = "https://ticketing.com/app/users/currentuser"
$Url = "https://biketrailshg-mvp1.herokuapp.com"
Invoke-RestMethod -Method 'Get' -Uri $url -OutFile output.csv