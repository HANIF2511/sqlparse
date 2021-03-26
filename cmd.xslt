<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ccap="http://ericsson.com/services/ws_cma3/ccapisubscribercreate" xmlns:cus="http://ericsson.com/services/ws_cma3/customernew" xmlns:mon="http://lhsgroup.com/lhsws/money" xmlns:add="http://ericsson.com/services/ws_cma3/addresswrite" xmlns:cus1="http://ericsson.com/services/ws_cma3/customerwrite" xmlns:cus2="http://ericsson.com/services/ws_cma3/customerread" xmlns:con="http://ericsson.com/services/ws_cma3/contractnew" xmlns:ses="http://ericsson.com/services/ws_cma3/sessionchange">		
<xsl:output method="xml" indent="yes" encoding="UTF-8" /> 		
<xsl:template match="/">		
<xsl:for-each select="data">		

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<soapenv:Body>
<getDate xmlns="http://service.web.com.simswap">
<subno><xsl:value-of select="SUBNO"/></subno>
</getDate>
</soapenv:Body>
</soapenv:Envelope>
</xsl:for-each>		
</xsl:template>		
</xsl:stylesheet>