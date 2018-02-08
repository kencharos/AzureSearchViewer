# azure-search-viewer


Azure search document viewer and update/ remove documents. 
This is node.js server application.

## useage

1. `npm install`
2. change settings.json with your azure search URL and key.
    + this also uses multiple azure search services.
3. run `node server.js`
4. access http://localhost:1337/

## (option )Deploy to azure

this app run web apps with AAD(Authorization/Aithentication),

refs: https://docs.microsoft.com/ja-jp/azure/app-service/app-service-web-get-started-nodejs

1. archive and uplod zip

2. run command in azure cli

```
az webapp deployment source config-zip --resource-group <your resource group> --name <your app ame> --src <zip>
```

if web.config doesn't exits. make web.config follwing

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="node-application" path="server.js" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="node-application">
          <action type="Rewrite" url="server.js" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

