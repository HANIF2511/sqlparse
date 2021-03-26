<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ccap="http://ericsson.com/services/ws_cma3/ccapisubscribercreate" xmlns:cus="http://ericsson.com/services/ws_cma3/customernew" xmlns:mon="http://lhsgroup.com/lhsws/money" xmlns:add="http://ericsson.com/services/ws_cma3/addresswrite" xmlns:cus1="http://ericsson.com/services/ws_cma3/customerwrite" xmlns:cus2="http://ericsson.com/services/ws_cma3/customerread" xmlns:con="http://ericsson.com/services/ws_cma3/contractnew" xmlns:ses="http://ericsson.com/services/ws_cma3/sessionchange">
<xsl:output method="xml" indent="yes" encoding="UTF-8" /> 
<xsl:template match="/">

<xsl:for-each select="data">

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ccap="http://ericsson.com/services/ws_cma3/ccapisubscribercreate" xmlns:cus="http://ericsson.com/services/ws_cma3/customernew" xmlns:mon="http://lhsgroup.com/lhsws/money" xmlns:add="http://ericsson.com/services/ws_cma3/addresswrite" xmlns:cus1="http://ericsson.com/services/ws_cma3/customerwrite" xmlns:cus2="http://ericsson.com/services/ws_cma3/customerread" xmlns:con="http://ericsson.com/services/ws_cma3/contractnew" xmlns:ses="http://ericsson.com/services/ws_cma3/sessionchange">
   <soapenv:Header >
      <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
         <wsse:UsernameToken wsu:Id="UsernameToken-7">
            <wsse:Username><xsl:value-of select="Username"/></wsse:Username>
            <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText"><xsl:value-of select="Password"/></wsse:Password>
            <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary"><xsl:value-of select="Nonce"/></wsse:Nonce>
            <wsu:Created><xsl:value-of select="Created"/></wsu:Created>
         </wsse:UsernameToken>
      </wsse:Security>
   </soapenv:Header>
   <soapenv:Body>
      <con:contractsSearchRequest>
            <con:inputAttributes>
            <con:searcher>ContractSearchWithoutHistory</con:searcher>
            <con:dirnum><xsl:value-of select="MSIN"/></con:dirnum>
            </con:inputAttributes>
         <con:sessionChangeRequest>
            <ses:values>
               <ses:item>
                  <ses:key>BU_ID</ses:key>
                  <ses:value>2</ses:value>
               </ses:item>
            </ses:values>
         </con:sessionChangeRequest>
      </con:contractsSearchRequest>
   </soapenv:Body>
</soapenv:Envelope>
</xsl:for-each>
</xsl:template>
</xsl:stylesheet>

