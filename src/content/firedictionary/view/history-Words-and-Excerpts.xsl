<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:hs="http://www.firedictionary.com/history">
  <xsl:template match="/">
          <table>
            <xsl:apply-templates select="hs:firedictionary/hs:history/hs:items/hs:item"/>
          </table>
  </xsl:template>
  
  <xsl:template match="hs:item">
    <tr>
    <td width='100'>
      <font size='-1' face='Arial, Helvetica, sans-serif'>
        <strong>
          <xsl:value-of select="hs:keyword"/>
        </strong>
      </font>
    </td>
    <td>
      <font size='-1' face='Arial, Helvetica, sans-serif'>
        <xsl:value-of select="hs:result"/>
      </font>
    </td>
    </tr>
    <xsl:apply-templates select="hs:sentence"/>
  </xsl:template>

  <xsl:template match="hs:sentence">
    <xsl:variable name="sentence" select="."/>
    <xsl:variable name="pickedup" select="../hs:pickedupword"/>
    <xsl:variable name="sentence1" select="substring-before($sentence, $pickedup)"/>
    <xsl:variable name="sentence2" select="substring-after($sentence, $pickedup)"/>
    <tr>
      <td>
      </td>
      <td>
        <font size='-1' face='Arial, Helvetica, sans-serif'>
          <p>
            <xsl:value-of select="$sentence1"/>
            <font color="#FF0000"><xsl:value-of select="$pickedup"/></font>
            <xsl:value-of select="$sentence2"/>
          </p>
          <p>
            <div align="right">
              <xsl:element name="a">
                <xsl:attribute name="href">
                  <xsl:value-of select="../hs:url"/>
                </xsl:attribute>
                <em>---- <xsl:value-of select="../hs:title"/></em>
              </xsl:element>
              <br />
              <p>
                <xsl:if test="../hs:category != ''">
                  [ <xsl:value-of select="../hs:category"/> ]
                </xsl:if>
                <xsl:value-of select="../hs:date"/>
              </p><br />
            </div>
          </p>
        </font>
      </td>
    </tr>
  </xsl:template>
</xsl:stylesheet>