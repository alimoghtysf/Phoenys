/*==================================================
  AS3Compiler_Part17.js
  XML + E4X (ECMAScript for XML) Support - Part 17
  هذا الجزء يسمح للمترجم بفهم ومعالجة بيانات XML كما في الفلاش
==================================================*/

import {AVM2Bytecode} from './AVM2_Bytecode.js';

export class XMLNode {
    constructor(name, value = null) {
        this.name = name;
        this.value = value;
        this.attributes = {};
        this.children = [];
    }
}

export class AS3XML {
    constructor(xmlString) {
        this.root = this.parse(xmlString);
    }

    // محاكي بسيط لتحويل النص إلى كائنات XML
    parse(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        return this.convertNode(xmlDoc.documentElement);
    }

    convertNode(domNode) {
        const node = new XMLNode(domNode.nodeName, domNode.textContent);
        
        // تحويل الخصائص (Attributes)
        if (domNode.attributes) {
            for (let attr of domNode.attributes) {
                node.attributes[attr.name] = attr.value;
            }
        }

        // تحويل الأبناء (Children)
        for (let child of domNode.childNodes) {
            if (child.nodeType === 1) { // Element Node
                node.children.push(this.convertNode(child));
            }
        }
        return node;
    }

    // الوصول للعناصر بطريقة الفلاش (.. أو .)
    child(name) {
        return this.root.children.filter(c => c.name === name);
    }

    attribute(name) {
        return this.root.attributes[name];
    }

    toString() {
        return this.root.value;
    }
}

export class AS3CompilerPart17 {
    constructor() {
        this.xmlStorage = {};
    }

    // دالة لترجمة كود XML داخل المترجم
    compileXMLDeclaration(variableName, xmlContent) {
        const avm2 = new AVM2Bytecode();
        const xmlInstance = new AS3XML(xmlContent);
        this.xmlStorage[variableName] = xmlInstance;

        // توليد بايت كود لإنشاء كائن XML في الذاكرة
        avm2.push({op: 'newclass', className: 'XML', value: xmlContent});
        avm2.push({op: 'setglobal', name: variableName});
        
        return avm2;
    }

    // محاكاة الوصول لخصائص XML برمجياً
    compileXMLAccess(xmlVar, property, isAttribute = false) {
        const xml = this.xmlStorage[xmlVar];
        if (!xml) return null;

        if (isAttribute) {
            return xml.attribute(property);
        } else {
            return xml.child(property);
        }
    }
}

/*==================================================
  END OF AS3Compiler_Part17.js
==================================================*/
