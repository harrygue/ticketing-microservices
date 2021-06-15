#$Cred = Get-Credential
$Url = "https://biketrailshg-mvp1.herokuapp.com/login"
$Body = @{
    username = "Harald"
    password = "xxxx"
}
# -Credential $Cred 
Invoke-RestMethod -Method 'Post' -Uri $url -Body $body -OutFile output.csv