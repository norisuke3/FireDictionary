<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:hs="http://www.firedictionary.com/history">
  
  <xsl:template match="/">
    <xsl:apply-templates select="hs:firedictionary/hs:history/hs:items/hs:item" />
  </xsl:template>
  
  <xsl:template match="hs:item">[ <xsl:value-of select="hs:keyword"/> ]
  <xsl:value-of select="hs:result"/>
-----------------------------------------
</xsl:template>
</xsl:stylesheet>