<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:hs="http://www.firedictionary.com/history">
  <xsl:template match="/">
            <xsl:apply-templates select="hs:firedictionary/hs:history/hs:items"/>
  </xsl:template>

  <xsl:template match="hs:items">
    <xsl:apply-templates select="hs:item">
      <xsl:sort select="./hs:keyword" data-type="text" order="ascending"/>
    </xsl:apply-templates>
  </xsl:template>
  
  <xsl:template match="hs:item">
      <font size='-1' face='Arial, Helvetica, sans-serif'>
        <xsl:value-of select="concat(hs:keyword, ' ')"/>
      </font>
  </xsl:template>
</xsl:stylesheet>