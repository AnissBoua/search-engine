const readline = require("readline");

// CONSTS
const CONCAT = 0xC04CA7;
const ETOILE = 0xE7011E;
const ALTERN = 0xA17E54;
const PROTECTION = 0xBADDAD;
const PARENTHESEOUVRANT = 0x16641664;
const PARENTHESEFERMANT = 0x51515151;
const DOT = 0xD07;

function ask_regex(): Promise<string> {
    const reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        reader.question("Please enter a regex: ", answer => {
            reader.close();
            resolve(answer);
        });
    });
}

function ascii_codes(regEx: string): void {
    let output = `  >> ASCII codes: [${regEx.charCodeAt(0)}`;
    for (let i = 1; i < regEx.length; i++) {
        output += `,${regEx.charCodeAt(i)}`;
    }
    output += "].";
    console.log(output);
}

function char_to_root(char: string): number {
    switch (char) {
        case '.':
            return CONCAT;
        case '*':
            return ETOILE;
        case '|':
            return ALTERN;
        case '(':
            return PARENTHESEOUVRANT;
        case ')':
            return PARENTHESEFERMANT;
        case '\\':
            return PROTECTION;
        case '.':
            return DOT;
        default:
            return char.charCodeAt(0);
    }
}

function contain_parenthese(trees: RegexTree[]): boolean {
    for (let t of trees) {
        if (t.root == PARENTHESEFERMANT || t.root == PARENTHESEOUVRANT) return true;
    }
    return false;
}

function process_parenthese(trees: RegexTree[]): RegexTree[] {
    console.log("Processing parenthesis");
    for (let t of trees) {
        console.log(t.to_string());
    }
    
    let result: RegexTree[] = [];
    let found: boolean = false;
    for (let t of trees) {
        if (!found && t.root == PARENTHESEFERMANT) {
            let done: boolean = false;
            let content: RegexTree[] = [];
            while (!done && result.length > 0) {
                if (result[result.length - 1].root == PARENTHESEOUVRANT) {
                    done = true;
                    result.pop();
                } else {
                    const popped = result.pop();
                    if (popped !== undefined) content.unshift(popped);
                }
            }

            if (!done) {
                console.error("Error: no opening parenthesis found");
                return [];
            }
            found = true;
            let subTrees: RegexTree[] = [];
            subTrees.push(sub_parse(content));
            result.push(new RegexTree(PROTECTION, subTrees));
        } else {
            result.push(t);
        }
    }

    if (!found) {
        console.error("Error: no closing parenthesis found");
        return [];
    }
    return result;
}

function contain_etoile(trees: RegexTree[]): boolean {
    for (let t of trees) {
        if (t.root == ETOILE && t.branches.length === 0) return true;
    }
    return false;
}

function process_etoile(trees: RegexTree[]): RegexTree[] {
    console.log("Processing etoiles");
    for (let t of trees) {
        console.log(t.to_string());
    }

    let result: RegexTree[] = [];
    let found: boolean = false;

    for (let t of trees) {
        if (!found && t.root == ETOILE && t.branches.length === 0) {
            if (result.length === 0) {
                console.error("Error: nothing to apply * on");
                return [];
            }
            found = true;
            let pop = result.pop();
            if (pop !== undefined) {
                let subTrees: RegexTree[] = [];
                subTrees.push(pop);
                result.push(new RegexTree(ETOILE, subTrees));
            }
        } else {
            result.push(t);
        }
    }

    return result;
}

function contain_concat(trees: RegexTree[]): boolean {
    let found: boolean = false;

    for (let t of trees) {
        if (!found && t.root !== ALTERN) {
            found = true;
            continue;
        }
        if (found) {
            if (t.root !== ALTERN) return true;
            else found = false;
        }
    }

    return false;
}

function process_concat(trees: RegexTree[]): RegexTree[] {
    console.log("Processing concatenation");
    for (let t of trees) {
        console.log(t.to_string());
    }
    let result: RegexTree[] = [];
    let found: boolean = false;
    let first_found: boolean = false;

    for (let t of trees) {
        if (!found && !first_found && t.root !== ALTERN) {
            first_found = true;
            result.push(t);
            continue;
        }
        if (!found && first_found && t.root === ALTERN) {
            first_found = false;
            result.push(t);
            continue;
        }
        if (!found && first_found && t.root !== ALTERN) {
            found = true;
            let last = result.pop();
            if (last !== undefined) {
                let subTrees: RegexTree[] = [];
                subTrees.push(last);
                subTrees.push(t);
                result.push(new RegexTree(CONCAT, subTrees));
            }
        } else {
            result.push(t);
        }
    }

    return result;
}

function contain_altern(trees: RegexTree[]): boolean {
    for (let t of trees) {
        if (t.root == ALTERN && t.branches.length === 0) return true;
    }

    return false;
}

function process_altern(trees: RegexTree[]): RegexTree[] {
    console.log("Processing alternatives");
    for (let t of trees) {
        console.log(t.to_string());
    }
    let result: RegexTree[] = [];
    let found: boolean = false;
    let gauche: RegexTree | null = null;
    let done: boolean = false;

    for (let t of trees) {
        if (!found && t.root == ALTERN && t.branches.length === 0) {
            if (result.length === 0) {
                console.error("Error: nothing to apply | on");
                return [];
            }
            found = true;
            let pop = result.pop();
            if (pop !== undefined) gauche = pop;
            continue;
        }

        if (found && !done) {
            if (gauche === null) {
                console.error("Error: gauche is null");
                return [];
            }
            done = true;
            let subTrees: RegexTree[] = [];
            subTrees.push(gauche);
            subTrees.push(t);
            result.push(new RegexTree(ALTERN, subTrees));
        } else {
            result.push(t);
        }
    }

    return result;
}

function remove_protection(tree: RegexTree): RegexTree {
    console.log("Removing protections");
    
    if (tree.root == PROTECTION && tree.branches.length !== 1) {
        console.error("Error: protection has not exactly one child");
        return tree;
    }
    if (tree.branches.length === 0) return tree;
    if (tree.root === PROTECTION) return remove_protection(tree.branches[0]);

    let subTrees: RegexTree[] = [];
    for (let t of tree.branches) {
        subTrees.push(remove_protection(t));
    }

    return new RegexTree(tree.root, subTrees);
}

function parse(regex: string): RegexTree {
    let result: RegexTree[] = [];

    for (let i = 0; i < regex.length; i++) {
        result.push(new RegexTree(char_to_root(regex[i]), []));
    }

    return sub_parse(result);
}

function sub_parse(branches: RegexTree[]): RegexTree {
    while (contain_parenthese(branches)) branches = process_parenthese(branches);
    while (contain_etoile(branches)) branches = process_etoile(branches);
    while (contain_concat(branches)) branches = process_concat(branches);
    while (contain_altern(branches)) branches = process_altern(branches);

    if (branches.length > 1) {
        console.error("Error sub_parse: branches length > 1");
        return branches[0];
    } 

    return remove_protection(branches[0]);
}

function regex_to_ndfa(tree: RegexTree): NDFAutomaton | null {
    if (tree.branches.length === 0) {
        let tTab: number[][] = [[-1], [-1]];
        let eTab: number[][] = [[], []];

        for (let i = 0; i < tTab.length; i++) {
            for (let col = 0; col < 256; col++) {
                tTab[i][col] = -1;
            }
        }

        for (let i = 0; i < eTab.length; i++) {
            eTab[i] = [];
        }
        
        if (tree.root !== DOT) tTab[0][tree.root] = 1;
        else {
            for (let i = 0; i < 256; i++) {
                tTab[0][i] = 1;
            }
        }
        return new NDFAutomaton(tTab, eTab);
    }

    if (tree.root === CONCAT) {
        let gauche: NDFAutomaton | null = regex_to_ndfa(tree.branches[0]);
        let droite: NDFAutomaton | null = regex_to_ndfa(tree.branches[1]);
        if (gauche === null || droite === null) {
            console.error("Error: null automaton");
            return null;
        }

        let tTab_g: number[][] = gauche.transitions;
        let eTab_g: number[][] = gauche.epsilon_transitions;

        let tTab_d: number[][] = droite.transitions;
        let eTab_d: number[][] = droite.epsilon_transitions;

        let lg: number = tTab_g.length;
        let ld: number = tTab_d.length;

        let tTab: number[][] = [];
        let eTab: number[][] = [];

        for (let i = 0; i < lg + ld; i++) {
            let row: number[] = [];
            for (let col = 0; col < 256; col++) {
                row.push(-1);
            }
            tTab.push(row);
            eTab.push([]);
        }

        eTab[lg - 1].push(lg);

        for (let i = 0; i < lg; i++) {
            for (let col = 0; col < 256; col++) {
                tTab[i][col] = tTab_g[i][col];
            }
        }

        for (let i = 0; i < lg; i++) {
            eTab[i] = eTab[i].concat(eTab_g[i]); // Maybe wrong
        }

        for (let i = lg; i < lg + ld - 1; i++) {
            for (let col = 0; col < 256; col++) {
                if (tTab_d[i - lg][col] !== -1) {
                    tTab[i][col] = tTab_d[i - lg][col] + lg;
                }
            }
        }

        for (let i = lg; i < lg + ld - 1; i++) {
            for (let s of eTab_d[i - lg]) {
                eTab[i].push(s + lg);
            }
        }

        return new NDFAutomaton(tTab, eTab);
    }

    if (tree.root === ALTERN) {
        let gauche: NDFAutomaton | null = regex_to_ndfa(tree.branches[0]);
        let droite: NDFAutomaton | null = regex_to_ndfa(tree.branches[1]);
        if (gauche === null || droite === null) {
            console.error("Error: null automaton");
            return null;
        }

        let tTab_g: number[][] = gauche.transitions;
        let eTab_g: number[][] = gauche.epsilon_transitions;

        let tTab_d: number[][] = droite.transitions;
        let eTab_d: number[][] = droite.epsilon_transitions;

        let lg: number = tTab_g.length;
        let ld: number = tTab_d.length;

        let tTab: number[][] = [];
        let eTab: number[][] = [];

        for (let i = 0; i < 2 + lg + ld; i++) {
            let row: number[] = [];
            for (let col = 0; col < 256; col++) {
                row.push(-1);
            }
            tTab.push(row);
            eTab.push([]);
        }

        eTab[0].push(1);
        eTab[0].push(1 + lg);
        eTab[1 + lg - 1].push(2 + lg + ld - 1);
        eTab[1 + lg + ld - 1].push(2 + lg + ld - 1);

        for (let i = 1; i < 1 + lg; i++) {
            for (let col = 0; col < 256; col++) {
                if (tTab_g[i - 1][col] !== -1) {
                    tTab[i][col] = tTab_g[i - 1][col] + 1;
                }
            }
        }

        for (let i = 1; i < 1 + lg; i++) {
            for (let s of eTab_g[i - 1]) {
                eTab[i].push(s + 1);
            }
        }

        for (let i = 1 + lg; i < 1 + lg + ld - 1; i++) {
            for (let col = 0; col < 256; col++) {
                if (tTab_d[i - 1 - lg][col] !== -1) {
                    tTab[i][col] = tTab_d[i - 1 - lg][col] + 1 + lg;
                }
            }
        }

        for (let i = 1 + lg; i < 1 + lg + ld; i++) {
            for (let s of eTab_d[i - 1 - lg]) {
                eTab[i].push(s + 1 + lg);
            }
        }

        return new NDFAutomaton(tTab, eTab);
    }

    if (tree.root === ETOILE) {
        let fils: NDFAutomaton | null = regex_to_ndfa(tree.branches[0]);
        if (fils === null) {
            console.error("Error: null automaton");
            return null;
        }

        let tTab_fils: number[][] = fils.transitions;
        let eTab_fils: number[][] = fils.epsilon_transitions;

        let l: number = tTab_fils.length;

        let tTab: number[][] = [];
        let eTab: number[][] = [];

        for (let i = 0; i < 2 + l; i++) {
            let row: number[] = [];
            for (let col = 0; col < 256; col++) {
                row.push(-1);
            }
            tTab.push(row);
            eTab.push([]);
        }

        eTab[0].push(1);
        eTab[0].push(2 + l - 1);

        eTab[2 + l - 2].push(2 + l - 1);
        eTab[2 + l - 2].push(1);

        for (let i = 1; i < 2 + l - 1; i++) {
            for (let col = 0; col < 256; col++) {
                if (tTab_fils[i - 1][col] !== -1) {
                    tTab[i][col] = tTab_fils[i - 1][col] + 1;
                }
            }
        }

        for (let i = 1; i < 2 + l - 1; i++) {
            for (let s of eTab_fils[i - 1]) {
                eTab[i].push(s + 1);
            }
        }

        return new NDFAutomaton(tTab, eTab);
    }

    return null;
}


async function main() {
    const args = process.argv.slice(2);
    let regex: string = "";
    
    if (args.length === 0) {
        console.error("Error: no regex provided");
        regex = await ask_regex();
    } else {
        regex = args.join(" ");
    }

    console.log("Regex construite:", regex);

    
    if (regex === "") {
        console.error("Error: empty regex");
        return;
    }

    ascii_codes(regex);
    // example_Aho_Ullman();

    let tree: RegexTree = parse(regex);
    console.log("Arbre construit:", tree.to_string());
    let ndfa = regex_to_ndfa(tree);
    if (ndfa === null) {
        console.error("Error: null automaton");
        return;
    }
    console.log("  >> NDFA construction:\n\nBEGIN NDFA\n" + ndfa.to_string() + " END NDFA.\n");
}

main();

class RegexTree {
    public root: number;
    public branches: RegexTree[];


    constructor(root: number, branches: RegexTree[]) {
        this.root = root;
        this.branches = branches;
    }

    public to_string(): string {
        if (this.branches.length === 0) return this.root_to_string();
        let output = this.root_to_string() + "(";
        output += this.branches[0].to_string();
        for (let i = 1; i < this.branches.length; i++) {
            output += ", " + this.branches[i].to_string();
        }
        return output + ")";
    }

    public root_to_string(): string {
        switch (this.root) {
            case CONCAT:
                return ".";
            case ETOILE:
                return "*";
            case ALTERN:
                return "|";
            case PROTECTION:
                return "\\";
            case PARENTHESEOUVRANT:
                return "(";
            case PARENTHESEFERMANT:
                return ")";
            case DOT:
                return ".";
            default:
                return String.fromCharCode(this.root);
        }
    }
}

class NDFAutomaton {
    //IMPLICIT REPRESENTATION HERE: INIT STATE IS ALWAYS 0; FINAL STATE IS ALWAYS transitionTable.length-1
    //ASCII transition
    public transitions: number[][];
    //epsilon transition list
    public epsilon_transitions: number[][];
    constructor(transitions: number[][], epsilon_transitions: number[][]) {
        this.transitions = transitions;
        this.epsilon_transitions = epsilon_transitions;
    }

    public to_string(): string {
        let result = `Initial state: 0\nFinal state: ${this.transitions.length - 1}\nTransition list:\n`;
        for (let i = 0; i < this.epsilon_transitions.length; i++) {
            for (let state of this.epsilon_transitions[i]) {
                result += `  ${i} -- epsilon --> ${state}\n`;
            }
        }

        for (let i = 0; i < this.transitions.length; i++) {
            for (let col = 0; col < 256; col++) {
                if (this.transitions[i][col] !== -1) {
                    result += `  ${i} -- ${String.fromCharCode(col)} --> ${this.transitions[i][col]}\n`;
                }
            }
        }

        return result;
    }
}


function example_Aho_Ullman() {
    let regEx: RegexTree = new RegexTree(0, []);
    let a: RegexTree = new RegexTree("a".charCodeAt(0), []);
    let b: RegexTree = new RegexTree("b".charCodeAt(0), []);
    let c: RegexTree = new RegexTree("c".charCodeAt(0), []);
    
    let subTrees: RegexTree[] = [];
    subTrees.push(c);
    let cEtoile: RegexTree = new RegexTree(ETOILE, subTrees);

    subTrees = [];
    subTrees.push(b);
    subTrees.push(cEtoile);
    let dotBCEtoile: RegexTree = new RegexTree(CONCAT, subTrees);

    subTrees = [];
    subTrees.push(a);
    subTrees.push(dotBCEtoile);
    regEx = new RegexTree(ALTERN, subTrees);
    console.log(regEx.to_string());
}