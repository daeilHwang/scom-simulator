const {XMLParser, XMLValidator, XMLBuilder } = require('fast-xml-parser');

export function xmlBuild(xml){
    let option = {
        ignoreAttributes : false,
        allowBooleanAttributes: true,
        alwaysCreateTextNode : true,
    }
    const builder = new XMLBuilder(option);
    // const builder = new XMLBuilder();
    return builder.build(xml);
}

export function xmlValidate(xml){
    return XMLValidator.validate(xml);
}

export async function xmlFilereader(file) {
    return new Promise(function(resolve, reject){
        try{
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = function(){
                resolve(reader.result);
            }
        }catch(err){
            reject(new Error(err));
        }
        
    });
}

export function xmlPretty(sourceXml){
    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    var xsltProcessor = new XSLTProcessor();    
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    var resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
}

export function xmlParser(xmlStr){
    let option = {
        ignoreAttributes : false,
        allowBooleanAttributes: true,
        alwaysCreateTextNode : true,
    }
    let parser = new XMLParser(option);
    // const builder = new XMLBuilder();
    // return builder.build(parser.parse(xmlStr));
    return parser.parse(xmlStr);
}