<?xml version="1.0" encoding="UTF-8" ?>

<!-- ***** BEGIN LICENSE BLOCK *****
   - Version: MPL 1.1/GPL 2.0/LGPL 2.1
   -
   - The contents of this file are subject to the Mozilla Public License Version
   - 1.1 (the "License"); you may not use this file except in compliance with
   - the License. You may obtain a copy of the License at
   - http://www.mozilla.org/MPL/
   -
   - Software distributed under the License is distributed on an "AS IS" basis,
   - WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
   - for the specific language governing rights and limitations under the
   - License.
   -
   - The Original Code is FireDictionary.
   -
   - The Initial Developer of the Original Code is
   - Noriaki Hamamoto <nori@firedictionary.com>.
   - Portions created by the Initial Developer are Copyright (C) 2005
   - the Initial Developer. All Rights Reserved.
   -
   - Contributor(s):
   -
   - Alternatively, the contents of this file may be used under the terms of
   - either the GNU General Public License Version 2 or later (the "GPL"), or
   - the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
   - in which case the provisions of the GPL or the LGPL are applicable instead
   - of those above. If you wish to allow use of your version of this file only
   - under the terms of either the GPL or the LGPL, and not to allow others to
   - use your version of this file under the terms of the MPL, indicate your
   - decision by deleting the provisions above and replace them with the notice
   - and other provisions required by the LGPL or the GPL. If you do not delete
   - the provisions above, a recipient may use your version of this file under
   - the terms of any one of the MPL, the GPL or the LGPL.
   -
   - ***** END LICENSE BLOCK ***** -->

<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:hs="http://www.firedictionary.com/history">
  
  <xsl:param name="category"></xsl:param>
  <xsl:param name="date"></xsl:param>
  <xsl:param name="keyword"></xsl:param>
  <xsl:param name="first-letter-of-the-keyword"></xsl:param>
  
  <xsl:template match="/">
          <table>
            <xsl:apply-templates select="hs:firedictionary/hs:history/hs:items"/>
          </table>
  </xsl:template>
  
  <xsl:template match="hs:items">
    <xsl:apply-templates select="hs:item
        [not(string($keyword)) or hs:keyword=$keyword]
        [not(string($date)) or hs:date=$date]
        [not(string($category)) or hs:category=$category]
        [not(string($first-letter-of-the-keyword)) or starts-with(hs:keyword, $first-letter-of-the-keyword)]
    ">
    </xsl:apply-templates>
  </xsl:template>
  
  <xsl:template match="hs:item">
    <tr>
    <td width='100'>
      <xsl:element name="a">
         <xsl:attribute name="name">
           <xsl:value-of select="hs:timestamp"/>
         </xsl:attribute>
      </xsl:element>
      <strong><xsl:value-of select="hs:keyword"/></strong>
    </td>
    <td>
      <xsl:value-of select="hs:result"/>
    </td>
    </tr>
    <xsl:apply-templates select="hs:sentence"/>
  </xsl:template>

  <xsl:template match="hs:sentence">
    <xsl:variable name="sentence" select="."/>
    <xsl:variable name="pickedup" select="concat(' ', ../hs:pickedupword, ' ')"/>
    <xsl:variable name="sentence1" select="substring-before($sentence, $pickedup)"/>
    <xsl:variable name="sentence2" select="substring-after($sentence, $pickedup)"/>
    <tr>
      <td>
      </td>
      <td>
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
            </p><br /><br />
          </div>
        </p>
      </td>
    </tr>
  </xsl:template>
</xsl:stylesheet>