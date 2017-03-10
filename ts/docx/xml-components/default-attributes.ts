import * as _ from "lodash";
import { BaseXmlComponent } from "./base";

export abstract class XmlAttributeComponent extends BaseXmlComponent {
    protected root: object;
    private xmlKeys: object;

    constructor(xmlKeys: object, properties: object) {
        super("_attr");
        this.xmlKeys = xmlKeys;

        this.root = properties;

        if (!properties) {
            this.root = {};
        }
    }

    public prepForXml(): {_attr: {[key: string]: (string | number | boolean)}} {
        const attrs = {};
        if (this.root !== undefined) {
            _.forOwn(this.root, (value, key) => {
                if (value !== undefined) {
                    const newKey = this.xmlKeys[key];
                    attrs[newKey] = value;
                }
            });
        }
        return {_attr: attrs};
    }
}
