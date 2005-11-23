<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:hs="http://www.firedictionary.com/history">
  <xsl:template match="hs:firedictionary">
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template match="hs:history">
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template match="hs:items">
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template match="hs:item">
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template match="hs:keyword">[ <xsl:value-of select="."/> ]  
</xsl:template>

  <xsl:template match="hs:result" xml:space="preserve">  <xsl:value-of select="."/>
-----------------------------------------
</xsl:template>
    
  <xsl:template match="hs:url"/>
  <xsl:template match="hs:title"/>
  <xsl:template match="hs:sentence"/>
  <xsl:template match="hs:category"/>
  <xsl:template match="hs:timestamp"/>
</xsl:stylesheet>