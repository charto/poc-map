export type OutJSON = {[key: string]: any};

export class ParserXML {

	/** Insert a child into an element. */

	addChild(output: OutJSON, name: string, child: any) {
		if(!output.hasOwnProperty(name)) {
			output[name] = child;
		} else {
			// Same type of child already exists. Create an array of them.

			if(!(output[name] instanceof Array)) output[name] = [output[name]];

			output[name].push(child);
		}
	}

	/** Insert a child with a namespace into an element. */

	addChildNS(output: OutJSON, name: string, child: any, conflictPrefix?: string) {
		var namespace: string;
		var splitPos = name.indexOf(':');

		if(splitPos >= 0) {
			namespace = name.substr(0, splitPos);
			name = name.substr(splitPos + 1);
		}

		var nameFull = namespace ? (namespace + ':' + name) : name;

		if(conflictPrefix && (output.hasOwnProperty(name) || output.hasOwnProperty(nameFull))) {
			// If the name conflicts with an existing child, add a prefix.

			name = conflictPrefix + name;
			nameFull = namespace ? (namespace + ':' + name) : name
		}

		if(namespace) this.addChild(output, nameFull, child);

		this.addChild(output, name, child);
	}

	/** Parse an XML element and its children into a JSON object. */

	parse(node: Element): {[key: string]: any} | string {
		var output: OutJSON = {};

		if(node.nodeType == (node.TEXT_NODE || 3)) {
			return(node.nodeValue.trim());
		}

		var children = (node as HTMLElement).children || [] as Element[];
		var attributes = node.attributes || [] as Attr[];
		var text: string;
		var namespace: string;
		var name: string;

		if(!children.length && node.textContent) {
			text = node.textContent.trim();
			if(!attributes.length) return(text);

			if(text.length) output[ParserXML.textContentName] = text;
		}

		for(var child of (children as Element[])) {
			name = child.nodeName;
			var childParsed = this.parse(child);

			this.addChildNS(output, name, childParsed);
		}

		for(var attr of (attributes as Attr[])) {
			name = attr.name;

			this.addChildNS(output, name, attr.value, ParserXML.attributePrefix);
		}

		return(output);
	}

	/** Prefix for attributes named identically to children. */

	static attributePrefix = '$';

	/** Member name for plain text content. */

	static textContentName = 'text';
}
