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
               xmlns:ad="http://www.firedictionary.com/advertisement">
  <xsl:param name="number">1</xsl:param>
  <xsl:template match="/">
    <xsl:apply-templates select="ad:firedictionary/ad:advertisements"/>
  </xsl:template>

  <xsl:template match="ad:advertisements">
    <table id="server-information">
      <tr id="information">
        <td>
          <xsl:apply-templates select="ad:advertisement"/>
        </td>
      </tr>

      <tr id="caption">
        <td>
          Ads by FireDictionary
        </td>
      </tr>
    </table>
  </xsl:template>

  <xsl:template match="ad:advertisement[string(ad:url)]">
    <xsl:if test="position()=$number">
      <xsl:element name="a">
        <xsl:attribute name="href">
          <xsl:value-of select="ad:url"/>
        </xsl:attribute>
        <p>
          <xsl:value-of select="ad:title"/>
        </p>
      </xsl:element>
      
      <xsl:value-of select="ad:message"/>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="ad:advertisement[not(string(ad:url))]">
    <xsl:if test="position()=$number">
      <p>
        <xsl:value-of select="ad:title"/>
      </p>
      <xsl:value-of select="ad:message"/>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>