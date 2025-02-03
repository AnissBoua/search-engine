var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var readline = require("readline");
// CONSTS
var CONCAT = 0xC04CA7;
var ETOILE = 0xE7011E;
var ALTERN = 0xA17E54;
var PROTECTION = 0xBADDAD;
var PARENTHESEOUVRANT = 0x16641664;
var PARENTHESEFERMANT = 0x51515151;
var DOT = 0xD07;
function ask_regex() {
    var reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(function (resolve) {
        reader.question("Please enter a regex: ", function (answer) {
            reader.close();
            resolve(answer);
        });
    });
}
function ascii_codes(regEx) {
    var output = "  >> ASCII codes: [".concat(regEx.charCodeAt(0));
    for (var i = 1; i < regEx.length; i++) {
        output += ",".concat(regEx.charCodeAt(i));
    }
    output += "].";
    console.log(output);
}
function char_to_root(char) {
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
function contain_parenthese(trees) {
    for (var _i = 0, trees_1 = trees; _i < trees_1.length; _i++) {
        var t = trees_1[_i];
        if (t.root == PARENTHESEFERMANT || t.root == PARENTHESEOUVRANT)
            return true;
    }
    return false;
}
function process_parenthese(trees) {
    console.log("Processing parenthesis");
    for (var _i = 0, trees_2 = trees; _i < trees_2.length; _i++) {
        var t = trees_2[_i];
        console.log(t.to_string());
    }
    var result = [];
    var found = false;
    for (var _a = 0, trees_3 = trees; _a < trees_3.length; _a++) {
        var t = trees_3[_a];
        if (!found && t.root == PARENTHESEFERMANT) {
            var done = false;
            var content = [];
            while (!done && result.length > 0) {
                if (result[result.length - 1].root == PARENTHESEOUVRANT) {
                    done = true;
                    result.pop();
                }
                else {
                    var popped = result.pop();
                    if (popped !== undefined)
                        content.unshift(popped);
                }
            }
            if (!done) {
                console.error("Error: no opening parenthesis found");
                return [];
            }
            found = true;
            var subTrees = [];
            subTrees.push(sub_parse(content));
            result.push(new RegexTree(PROTECTION, subTrees));
        }
        else {
            result.push(t);
        }
    }
    if (!found) {
        console.error("Error: no closing parenthesis found");
        return [];
    }
    return result;
}
function contain_etoile(trees) {
    for (var _i = 0, trees_4 = trees; _i < trees_4.length; _i++) {
        var t = trees_4[_i];
        if (t.root == ETOILE && t.branches.length === 0)
            return true;
    }
    return false;
}
function process_etoile(trees) {
    console.log("Processing etoiles");
    for (var _i = 0, trees_5 = trees; _i < trees_5.length; _i++) {
        var t = trees_5[_i];
        console.log(t.to_string());
    }
    var result = [];
    var found = false;
    for (var _a = 0, trees_6 = trees; _a < trees_6.length; _a++) {
        var t = trees_6[_a];
        if (!found && t.root == ETOILE && t.branches.length === 0) {
            if (result.length === 0) {
                console.error("Error: nothing to apply * on");
                return [];
            }
            found = true;
            var pop = result.pop();
            if (pop !== undefined) {
                var subTrees = [];
                subTrees.push(pop);
                result.push(new RegexTree(ETOILE, subTrees));
            }
        }
        else {
            result.push(t);
        }
    }
    return result;
}
function contain_concat(trees) {
    var found = false;
    for (var _i = 0, trees_7 = trees; _i < trees_7.length; _i++) {
        var t = trees_7[_i];
        if (!found && t.root !== ALTERN) {
            found = true;
            continue;
        }
        if (found) {
            if (t.root !== ALTERN)
                return true;
            else
                found = false;
        }
    }
    return false;
}
function process_concat(trees) {
    console.log("Processing concatenation");
    for (var _i = 0, trees_8 = trees; _i < trees_8.length; _i++) {
        var t = trees_8[_i];
        console.log(t.to_string());
    }
    var result = [];
    var found = false;
    var first_found = false;
    for (var _a = 0, trees_9 = trees; _a < trees_9.length; _a++) {
        var t = trees_9[_a];
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
            var last = result.pop();
            if (last !== undefined) {
                var subTrees = [];
                subTrees.push(last);
                subTrees.push(t);
                result.push(new RegexTree(CONCAT, subTrees));
            }
        }
        else {
            result.push(t);
        }
    }
    return result;
}
function contain_altern(trees) {
    for (var _i = 0, trees_10 = trees; _i < trees_10.length; _i++) {
        var t = trees_10[_i];
        if (t.root == ALTERN && t.branches.length === 0)
            return true;
    }
    return false;
}
function process_altern(trees) {
    console.log("Processing alternatives");
    for (var _i = 0, trees_11 = trees; _i < trees_11.length; _i++) {
        var t = trees_11[_i];
        console.log(t.to_string());
    }
    var result = [];
    var found = false;
    var gauche = null;
    var done = false;
    for (var _a = 0, trees_12 = trees; _a < trees_12.length; _a++) {
        var t = trees_12[_a];
        if (!found && t.root == ALTERN && t.branches.length === 0) {
            if (result.length === 0) {
                console.error("Error: nothing to apply | on");
                return [];
            }
            found = true;
            var pop = result.pop();
            if (pop !== undefined)
                gauche = pop;
            continue;
        }
        if (found && !done) {
            if (gauche === null) {
                console.error("Error: gauche is null");
                return [];
            }
            done = true;
            var subTrees = [];
            subTrees.push(gauche);
            subTrees.push(t);
            result.push(new RegexTree(ALTERN, subTrees));
        }
        else {
            result.push(t);
        }
    }
    return result;
}
function remove_protection(tree) {
    console.log("Removing protections");
    if (tree.root == PROTECTION && tree.branches.length !== 1) {
        console.error("Error: protection has not exactly one child");
        return tree;
    }
    if (tree.branches.length === 0)
        return tree;
    if (tree.root === PROTECTION)
        return remove_protection(tree.branches[0]);
    var subTrees = [];
    for (var _i = 0, _a = tree.branches; _i < _a.length; _i++) {
        var t = _a[_i];
        subTrees.push(remove_protection(t));
    }
    return new RegexTree(tree.root, subTrees);
}
function parse(regex) {
    var result = [];
    for (var i = 0; i < regex.length; i++) {
        result.push(new RegexTree(char_to_root(regex[i]), []));
    }
    return sub_parse(result);
}
function sub_parse(branches) {
    while (contain_parenthese(branches))
        branches = process_parenthese(branches);
    while (contain_etoile(branches))
        branches = process_etoile(branches);
    while (contain_concat(branches))
        branches = process_concat(branches);
    while (contain_altern(branches))
        branches = process_altern(branches);
    if (branches.length > 1) {
        console.error("Error sub_parse: branches length > 1");
        return branches[0];
    }
    return remove_protection(branches[0]);
}
function regex_to_ndfa(tree) {
    if (tree.branches.length === 0) {
        var tTab = [[-1], [-1]];
        var eTab = [[], []];
        for (var i = 0; i < tTab.length; i++) {
            for (var col = 0; col < 256; col++) {
                tTab[i][col] = -1;
            }
        }
        for (var i = 0; i < eTab.length; i++) {
            eTab[i] = [];
        }
        if (tree.root !== DOT)
            tTab[0][tree.root] = 1;
        else {
            for (var i = 0; i < 256; i++) {
                tTab[0][i] = 1;
            }
        }
        return new NDFAutomaton(tTab, eTab);
    }
    if (tree.root === CONCAT) {
        var gauche = regex_to_ndfa(tree.branches[0]);
        var droite = regex_to_ndfa(tree.branches[1]);
        if (gauche === null || droite === null) {
            console.error("Error: null automaton");
            return null;
        }
        var tTab_g = gauche.transitions;
        var eTab_g = gauche.epsilon_transitions;
        var tTab_d = droite.transitions;
        var eTab_d = droite.epsilon_transitions;
        var lg = tTab_g.length;
        var ld = tTab_d.length;
        var tTab = [];
        var eTab = [];
        for (var i = 0; i < lg + ld; i++) {
            var row = [];
            for (var col = 0; col < 256; col++) {
                row.push(-1);
            }
            tTab.push(row);
            eTab.push([]);
        }
        eTab[lg - 1].push(lg);
        for (var i = 0; i < lg; i++) {
            for (var col = 0; col < 256; col++) {
                tTab[i][col] = tTab_g[i][col];
            }
        }
        for (var i = 0; i < lg; i++) {
            eTab[i] = eTab[i].concat(eTab_g[i]); // Maybe wrong
        }
        for (var i = lg; i < lg + ld - 1; i++) {
            for (var col = 0; col < 256; col++) {
                if (tTab_d[i - lg][col] !== -1) {
                    tTab[i][col] = tTab_d[i - lg][col] + lg;
                }
            }
        }
        for (var i = lg; i < lg + ld - 1; i++) {
            for (var _i = 0, _a = eTab_d[i - lg]; _i < _a.length; _i++) {
                var s = _a[_i];
                eTab[i].push(s + lg);
            }
        }
        return new NDFAutomaton(tTab, eTab);
    }
    if (tree.root === ALTERN) {
        var gauche = regex_to_ndfa(tree.branches[0]);
        var droite = regex_to_ndfa(tree.branches[1]);
        if (gauche === null || droite === null) {
            console.error("Error: null automaton");
            return null;
        }
        var tTab_g = gauche.transitions;
        var eTab_g = gauche.epsilon_transitions;
        var tTab_d = droite.transitions;
        var eTab_d = droite.epsilon_transitions;
        var lg = tTab_g.length;
        var ld = tTab_d.length;
        var tTab = [];
        var eTab = [];
        for (var i = 0; i < 2 + lg + ld; i++) {
            var row = [];
            for (var col = 0; col < 256; col++) {
                row.push(-1);
            }
            tTab.push(row);
            eTab.push([]);
        }
        eTab[0].push(1);
        eTab[0].push(1 + lg);
        eTab[1 + lg - 1].push(2 + lg + ld - 1);
        eTab[1 + lg + ld - 1].push(2 + lg + ld - 1);
        for (var i = 1; i < 1 + lg; i++) {
            for (var col = 0; col < 256; col++) {
                if (tTab_g[i - 1][col] !== -1) {
                    tTab[i][col] = tTab_g[i - 1][col] + 1;
                }
            }
        }
        for (var i = 1; i < 1 + lg; i++) {
            for (var _b = 0, _c = eTab_g[i - 1]; _b < _c.length; _b++) {
                var s = _c[_b];
                eTab[i].push(s + 1);
            }
        }
        for (var i = 1 + lg; i < 1 + lg + ld - 1; i++) {
            for (var col = 0; col < 256; col++) {
                if (tTab_d[i - 1 - lg][col] !== -1) {
                    tTab[i][col] = tTab_d[i - 1 - lg][col] + 1 + lg;
                }
            }
        }
        for (var i = 1 + lg; i < 1 + lg + ld; i++) {
            for (var _d = 0, _e = eTab_d[i - 1 - lg]; _d < _e.length; _d++) {
                var s = _e[_d];
                eTab[i].push(s + 1 + lg);
            }
        }
        return new NDFAutomaton(tTab, eTab);
    }
    if (tree.root === ETOILE) {
        var fils = regex_to_ndfa(tree.branches[0]);
        if (fils === null) {
            console.error("Error: null automaton");
            return null;
        }
        var tTab_fils = fils.transitions;
        var eTab_fils = fils.epsilon_transitions;
        var l = tTab_fils.length;
        var tTab = [];
        var eTab = [];
        for (var i = 0; i < 2 + l; i++) {
            var row = [];
            for (var col = 0; col < 256; col++) {
                row.push(-1);
            }
            tTab.push(row);
            eTab.push([]);
        }
        eTab[0].push(1);
        eTab[0].push(2 + l - 1);
        eTab[2 + l - 2].push(2 + l - 1);
        eTab[2 + l - 2].push(1);
        for (var i = 1; i < 2 + l - 1; i++) {
            for (var col = 0; col < 256; col++) {
                if (tTab_fils[i - 1][col] !== -1) {
                    tTab[i][col] = tTab_fils[i - 1][col] + 1;
                }
            }
        }
        for (var i = 1; i < 2 + l - 1; i++) {
            for (var _f = 0, _g = eTab_fils[i - 1]; _f < _g.length; _f++) {
                var s = _g[_f];
                eTab[i].push(s + 1);
            }
        }
        return new NDFAutomaton(tTab, eTab);
    }
    return null;
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, regex, tree, ndfa;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv.slice(2);
                    regex = "";
                    if (!(args.length === 0)) return [3 /*break*/, 2];
                    console.error("Error: no regex provided");
                    return [4 /*yield*/, ask_regex()];
                case 1:
                    regex = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    regex = args.join(" ");
                    _a.label = 3;
                case 3:
                    console.log("Regex construite:", regex);
                    if (regex === "") {
                        console.error("Error: empty regex");
                        return [2 /*return*/];
                    }
                    ascii_codes(regex);
                    tree = parse(regex);
                    console.log("Arbre construit:", tree.to_string());
                    ndfa = regex_to_ndfa(tree);
                    if (ndfa === null) {
                        console.error("Error: null automaton");
                        return [2 /*return*/];
                    }
                    console.log("  >> NDFA construction:\n\nBEGIN NDFA\n" + ndfa.to_string() + " END NDFA.\n");
                    return [2 /*return*/];
            }
        });
    });
}
main();
var RegexTree = /** @class */ (function () {
    function RegexTree(root, branches) {
        this.root = root;
        this.branches = branches;
    }
    RegexTree.prototype.to_string = function () {
        if (this.branches.length === 0)
            return this.root_to_string();
        var output = this.root_to_string() + "(";
        output += this.branches[0].to_string();
        for (var i = 1; i < this.branches.length; i++) {
            output += ", " + this.branches[i].to_string();
        }
        return output + ")";
    };
    RegexTree.prototype.root_to_string = function () {
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
    };
    return RegexTree;
}());
var NDFAutomaton = /** @class */ (function () {
    function NDFAutomaton(transitions, epsilon_transitions) {
        this.transitions = transitions;
        this.epsilon_transitions = epsilon_transitions;
    }
    NDFAutomaton.prototype.to_string = function () {
        var result = "Initial state: 0\nFinal state: ".concat(this.transitions.length - 1, "\nTransition list:\n");
        for (var i = 0; i < this.epsilon_transitions.length; i++) {
            for (var _i = 0, _a = this.epsilon_transitions[i]; _i < _a.length; _i++) {
                var state = _a[_i];
                result += "  ".concat(i, " -- epsilon --> ").concat(state, "\n");
            }
        }
        for (var i = 0; i < this.transitions.length; i++) {
            for (var col = 0; col < 256; col++) {
                if (this.transitions[i][col] !== -1) {
                    result += "  ".concat(i, " -- ").concat(String.fromCharCode(col), " --> ").concat(this.transitions[i][col], "\n");
                }
            }
        }
        return result;
    };
    return NDFAutomaton;
}());
function example_Aho_Ullman() {
    var regEx = new RegexTree(0, []);
    var a = new RegexTree("a".charCodeAt(0), []);
    var b = new RegexTree("b".charCodeAt(0), []);
    var c = new RegexTree("c".charCodeAt(0), []);
    var subTrees = [];
    subTrees.push(c);
    var cEtoile = new RegexTree(ETOILE, subTrees);
    subTrees = [];
    subTrees.push(b);
    subTrees.push(cEtoile);
    var dotBCEtoile = new RegexTree(CONCAT, subTrees);
    subTrees = [];
    subTrees.push(a);
    subTrees.push(dotBCEtoile);
    regEx = new RegexTree(ALTERN, subTrees);
    console.log(regEx.to_string());
}
