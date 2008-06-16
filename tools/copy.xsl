<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
        <xsl:template match="/">
            <xsl:apply-templates/>
        </xsl:template>
        
        <xsl:template match="@*|node()">
            <xsl:copy>
                <xsl:apply-templates select="@*|node()[not(local-name()='updateURL') and not(local-name()='updateKey')]"/>
            </xsl:copy>
        </xsl:template>    
</xsl:stylesheet>
