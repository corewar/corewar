﻿
import { Context } from "../Context";
import { IToken, TokenCategory } from "../interface/IToken";
import { Parser } from "../Parser";
import { Scanner } from "../Scanner";
import { PreprocessEmitter } from "../PreprocessEmitter";
import { Standard } from "../interface/IParseOptions";
import * as _ from "underscore";
"use strict";

describe("Scanner",() => {

    it("creates newline tokens for each line ending",() => {

        var document = "label\nlabel\n label\nlabel \nlabel label\nlabel label label\n";

        var scanner = new Scanner();
        var actual = scanner.scan(document, Parser.DefaultOptions).tokens;

        var newlines = _.where(actual, { category: TokenCategory.EOL, lexeme: "\n" });

        expect(newlines.length).toBe(7);
    });

    it("always creates a newline token for the final line",() => {

        var document = "line with ending\nline with no ending";

        var scanner = new Scanner();
        var actual = scanner.scan(document, Parser.DefaultOptions).tokens;

        var newlines = _.where(actual, { category: TokenCategory.EOL, lexeme: "\n" });

        expect(newlines.length).toBe(2);
    });

    it("tokenises opcodes to ICWS'94-draft standard",() => {

        var document = "DAT MOV ADD SUB MUL DIV MOD JMP JMZ JMN DJN CMP SLT SPL SEQ SNE NOP";

        var scanner = new Scanner();
        var actual = scanner.scan(document, Parser.DefaultOptions).tokens;

        expect(actual.length).toBe(18);

        for (var i = 0; i <= 16; i++) {
            expect(actual[i].category).toBe(TokenCategory.Opcode);
        }

        expect(actual[0].lexeme).toBe("DAT");
        expect(actual[1].lexeme).toBe("MOV");
        expect(actual[2].lexeme).toBe("ADD");
        expect(actual[3].lexeme).toBe("SUB");
        expect(actual[4].lexeme).toBe("MUL");
        expect(actual[5].lexeme).toBe("DIV");
        expect(actual[6].lexeme).toBe("MOD");
        expect(actual[7].lexeme).toBe("JMP");
        expect(actual[8].lexeme).toBe("JMZ");
        expect(actual[9].lexeme).toBe("JMN");
        expect(actual[10].lexeme).toBe("DJN");
        expect(actual[11].lexeme).toBe("CMP");
        expect(actual[12].lexeme).toBe("SLT");
        expect(actual[13].lexeme).toBe("SPL");
        expect(actual[14].lexeme).toBe("SEQ");
        expect(actual[15].lexeme).toBe("SNE");
        expect(actual[16].lexeme).toBe("NOP");
        // The 18th element will be a newline character
    });

    it("tokenises opcodes to ICWS'88 standard",() => {

        var document = "DAT MOV ADD SUB MUL DIV MOD JMP JMZ JMN DJN CMP SLT SPL";

        var scanner = new Scanner();
        var actual = scanner.scan(document, _.defaults({ standard: Standard.ICWS88 }, Parser.DefaultOptions)).tokens;

        var opcodes = _(actual).where({ category: TokenCategory.Opcode });
        var labels = _(actual).where({ category: TokenCategory.Label });

        expect(opcodes.length).toBe(11);
        expect(labels.length).toBe(3);

        expect(opcodes[0].lexeme).toBe("DAT");
        expect(opcodes[1].lexeme).toBe("MOV");
        expect(opcodes[2].lexeme).toBe("ADD");
        expect(opcodes[3].lexeme).toBe("SUB");
        expect(opcodes[4].lexeme).toBe("JMP");
        expect(opcodes[5].lexeme).toBe("JMZ");
        expect(opcodes[6].lexeme).toBe("JMN");
        expect(opcodes[7].lexeme).toBe("DJN");
        expect(opcodes[8].lexeme).toBe("CMP");
        expect(opcodes[9].lexeme).toBe("SLT");
        expect(opcodes[10].lexeme).toBe("SPL");

        expect(labels[0].lexeme).toBe("MUL");
        expect(labels[1].lexeme).toBe("DIV");
        expect(labels[2].lexeme).toBe("MOD");
    });

    it("tokenises opcodes to ICWS'86 standard",() => {

        var document = "DAT MOV ADD SUB MUL DIV MOD JMP JMZ JMN DJN CMP SLT SPL";

        var scanner = new Scanner();
        var actual = scanner.scan(document, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions)).tokens;

        var opcodes = _(actual).where({ category: TokenCategory.Opcode });
        var labels = _(actual).where({ category: TokenCategory.Label });

        expect(opcodes.length).toBe(10);
        expect(labels.length).toBe(4);

        expect(opcodes[0].lexeme).toBe("DAT");
        expect(opcodes[1].lexeme).toBe("MOV");
        expect(opcodes[2].lexeme).toBe("ADD");
        expect(opcodes[3].lexeme).toBe("SUB");
        expect(opcodes[4].lexeme).toBe("JMP");
        expect(opcodes[5].lexeme).toBe("JMZ");
        expect(opcodes[6].lexeme).toBe("JMN");
        expect(opcodes[7].lexeme).toBe("DJN");
        expect(opcodes[8].lexeme).toBe("CMP");
        expect(opcodes[9].lexeme).toBe("SPL");

        expect(labels[0].lexeme).toBe("MUL");
        expect(labels[1].lexeme).toBe("DIV");
        expect(labels[2].lexeme).toBe("MOD");
        expect(labels[3].lexeme).toBe("SLT");
    });

    it("tokenises preprocessor commands to ICWS'94-draft standard",() => {

        var document = "EQU END ORG";

        var scanner = new Scanner();
        var actual = scanner.scan(document, Parser.DefaultOptions).tokens;

        expect(actual.length).toBe(4);

        for (var i = 0; i <= 2; i++) {
            expect(actual[i].category).toBe(TokenCategory.Preprocessor);
        }

        expect(actual[0].lexeme).toBe("EQU");
        expect(actual[1].lexeme).toBe("END");
        expect(actual[2].lexeme).toBe("ORG");
    });

    it("tokenises preprocessor commands to ICWS'88 standard",() => {

        var document = "EQU END ORG";

        var scanner = new Scanner();
        var actual = scanner.scan(document, _.defaults({ standard: Standard.ICWS88 }, Parser.DefaultOptions)).tokens;

        var preprocessor = _(actual).where({ category: TokenCategory.Preprocessor });
        var labels = _(actual).where({ category: TokenCategory.Label });

        expect(preprocessor.length).toBe(2);
        expect(labels.length).toBe(1);

        expect(preprocessor[0].lexeme).toBe("EQU");
        expect(preprocessor[1].lexeme).toBe("END");
        expect(labels[0].lexeme).toBe("ORG");
    });

    it("tokenises preprocessor commands to ICWS'86 standard",() => {

        var document = "EQU END ORG";

        var scanner = new Scanner();
        var actual = scanner.scan(document, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions)).tokens;

        var preprocessor = _(actual).where({ category: TokenCategory.Preprocessor });
        var labels = _(actual).where({ category: TokenCategory.Label });

        expect(preprocessor.length).toBe(1);
        expect(labels.length).toBe(2);

        expect(preprocessor[0].lexeme).toBe("END");
        expect(labels[0].lexeme).toBe("EQU");
        expect(labels[1].lexeme).toBe("ORG");
    });

    it("correctly identifies a label which looks like a preprocessor instruction",() => {

        var document = "ORG2 MOV 0, 1\n";

        var scanner = new Scanner();
        var actual = scanner.scan(document, Parser.DefaultOptions).tokens;

        expect(actual.length).toBe(7);

        expect(actual[0].category).toBe(TokenCategory.Label);
        expect(actual[0].lexeme).toBe("ORG2");

        expect(actual[1].category).toBe(TokenCategory.Opcode);
        expect(actual[1].lexeme).toBe("MOV");
    });

    it("tokenises modes to ICWS'94-draft standard",() => {

        var document = "MOV.AB #25, $26\nDAT @1, <6\nJMP >7\nMOV {1, }2\nDAT *1";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Mode });

        expect(actual.length).toBe(8);

        expect(actual[0].lexeme).toBe("#");
        expect(actual[1].lexeme).toBe("$");
        expect(actual[2].lexeme).toBe("@");
        expect(actual[3].lexeme).toBe("<");
        expect(actual[4].lexeme).toBe(">");
        expect(actual[5].lexeme).toBe("{");
        expect(actual[6].lexeme).toBe("}");
        expect(actual[7].lexeme).toBe("*");
    });

    it("tokenises modes to ICWS'88 standard",() => {

        var document = "MOV.AB #25, $26\nDAT @1, <6\nJMP >7";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, _.defaults({ standard: Standard.ICWS88 }, Parser.DefaultOptions)).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Mode });

        expect(actual.length).toBe(4);

        expect(actual[0].lexeme).toBe("#");
        expect(actual[1].lexeme).toBe("$");
        expect(actual[2].lexeme).toBe("@");
        expect(actual[3].lexeme).toBe("<");
    });

    it("tokenises modes to ICWS'86 standard",() => {

        var document = "MOV.AB #25, $26\nDAT @1, <6\nJMP >7";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions)).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Mode });

        expect(actual.length).toBe(4);

        expect(actual[0].lexeme).toBe("#");
        expect(actual[1].lexeme).toBe("$");
        expect(actual[2].lexeme).toBe("@");
        expect(actual[3].lexeme).toBe("<");
    });

    it("tokenises commas",() => {

        var document = "MOV #25 , 26\nadd , ,, 21, 26";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Comma, lexeme: "," });

        expect(actual.length).toBe(5);
    });

    it("tokenises numbers",() => {

        var document = "mov 25, #26\nadd -27, @28\na123";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        expect(tokens[7].lexeme).toBe("-");
        expect(tokens[7].category).toBe(TokenCategory.Maths);

        var actual = _.where(tokens, { category: TokenCategory.Number });

        expect(actual.length).toBe(4);

        expect(actual[0].lexeme).toBe("25");
        expect(actual[1].lexeme).toBe("26");
        expect(actual[2].lexeme).toBe("27");
        expect(actual[3].lexeme).toBe("28");
    });

    it("tokenises modifiers to ICWS'94-draft standard",() => {

        var document = "MOV.A 0, 0\nADD.B 0, 0\n.AB 0, 0\nJMZ .BA 0, 0\nMOV 0,.F 0\nMOV 0, 0 .I\nMOV.X 0, 0\n. AB. BA. A . B. I";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Modifier });

        expect(actual.length).toBe(7);

        expect(actual[0].lexeme).toBe(".A");
        expect(actual[1].lexeme).toBe(".B");
        expect(actual[2].lexeme).toBe(".AB");
        expect(actual[3].lexeme).toBe(".BA");
        expect(actual[4].lexeme).toBe(".F");
        expect(actual[5].lexeme).toBe(".I");
        expect(actual[6].lexeme).toBe(".X");
    });

    it("considers modifiers as unknown in ICWS'88 standard",() => {

        var document = "MOV.A 0, 0\nADD.B 0, 0\n.AB 0, 0\nJMZ .BA 0, 0\nMOV 0,.F 0\nMOV 0, 0 .I\nMOV.X 0, 0\n. AB. BA. A . B. I";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, _.defaults({ standard: Standard.ICWS88 }, Parser.DefaultOptions)).tokens;

        var modifiers = _.where(tokens, { category: TokenCategory.Modifier });

        expect(modifiers.length).toBe(0);

        var unknown = _(tokens).where({ category: TokenCategory.Unknown });

        expect(unknown.length).toBe(12);

        expect(unknown[0].lexeme).toBe(".A");
        expect(unknown[1].lexeme).toBe(".B");
        expect(unknown[2].lexeme).toBe(".AB");
        expect(unknown[3].lexeme).toBe(".BA");
        expect(unknown[4].lexeme).toBe(".F");
        expect(unknown[5].lexeme).toBe(".I");
        expect(unknown[6].lexeme).toBe(".X");
        expect(unknown[7].lexeme).toBe(".");
        expect(unknown[8].lexeme).toBe(".");
        expect(unknown[9].lexeme).toBe(".");
        expect(unknown[10].lexeme).toBe(".");
        expect(unknown[11].lexeme).toBe(".");

        var labels = _(tokens).where({ category: TokenCategory.Label });

        expect(labels.length).toBe(5);

        expect(labels[0].lexeme).toBe("AB");
        expect(labels[1].lexeme).toBe("BA");
        expect(labels[2].lexeme).toBe("A");
        expect(labels[3].lexeme).toBe("B");
        expect(labels[4].lexeme).toBe("I");
    });

    it("considers modifiers as unknown in ICWS'86 standard",() => {

        var document = "MOV.A 0, 0\nADD.B 0, 0\n.AB 0, 0\nJMZ .BA 0, 0\nMOV 0,.F 0\nMOV 0, 0 .I\nMOV.X 0, 0\n. AB. BA. A . B. I";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions)).tokens;

        var modifiers = _.where(tokens, { category: TokenCategory.Modifier });

        expect(modifiers.length).toBe(0);

        var unknown = _(tokens).where({ category: TokenCategory.Unknown });

        expect(unknown.length).toBe(12);

        expect(unknown[0].lexeme).toBe(".A");
        expect(unknown[1].lexeme).toBe(".B");
        expect(unknown[2].lexeme).toBe(".AB");
        expect(unknown[3].lexeme).toBe(".BA");
        expect(unknown[4].lexeme).toBe(".F");
        expect(unknown[5].lexeme).toBe(".I");
        expect(unknown[6].lexeme).toBe(".X");
        expect(unknown[7].lexeme).toBe(".");
        expect(unknown[8].lexeme).toBe(".");
        expect(unknown[9].lexeme).toBe(".");
        expect(unknown[10].lexeme).toBe(".");
        expect(unknown[11].lexeme).toBe(".");

        var labels = _(tokens).where({ category: TokenCategory.Label });

        expect(labels.length).toBe(5);

        expect(labels[0].lexeme).toBe("AB");
        expect(labels[1].lexeme).toBe("BA");
        expect(labels[2].lexeme).toBe("A");
        expect(labels[3].lexeme).toBe("B");
        expect(labels[4].lexeme).toBe("I");
    });

    it("tokenises maths to ICWS'94-draft standard",() => {

        var document = "MOV 5 + 4\nADD.F 3 - 2\nabc EQU 3 / 2\nxyz EQU 4 * 3\ndef EQU 5 % 6";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Maths });

        expect(actual.length).toBe(5);

        expect(actual[0].lexeme).toBe("+");
        expect(actual[1].lexeme).toBe("-");
        expect(actual[2].lexeme).toBe("/");
        expect(actual[3].lexeme).toBe("*");
        expect(actual[4].lexeme).toBe("%");
    });

    it("tokenises maths to ICWS'88 standard",() => {

        var document = "MOV 5+4\nADD.F 3-2\nabc EQU 3/2\nxyz EQU 4*3\ndef EQU 5%6";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, _.defaults({ standard: Standard.ICWS88 }, Parser.DefaultOptions)).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Maths });

        expect(actual.length).toBe(4);

        expect(actual[0].lexeme).toBe("+");
        expect(actual[1].lexeme).toBe("-");
        expect(actual[2].lexeme).toBe("/");
        expect(actual[3].lexeme).toBe("*");

        expect(
            _(tokens).where({
                category: TokenCategory.Unknown,
                lexeme: "%6"
            }).length)
            .toBe(1);
    });

    it("tokenises maths to ICWS'86 standard",() => {

        var document = "MOV 5 + 4\nADD.F 3 - 2\nabc EQU 3 / 2\nxyz EQU 4 * 3\ndef EQU 5 % 6";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions)).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Maths });

        expect(actual.length).toBe(2);

        expect(actual[0].lexeme).toBe("+");
        expect(actual[1].lexeme).toBe("-");

        expect(
            _(tokens).filter((token: IToken) => {
                return token.category === TokenCategory.Unknown &&
                    (token.lexeme === "*" || token.lexeme === "/" || token.lexeme === "%");
            }).length)
            .toBe(3);
    });

    it("tokenises brackets as maths category in ICWS'94-draft standard",() => {

        var document = "MOV (5 + 4)*3\nlabel EQU (4 % ((3 + 2) - 1))";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Maths });

        expect(actual.length).toBe(13);

        expect(actual[0].lexeme).toBe("(");
        expect(actual[1].lexeme).toBe("+");
        expect(actual[2].lexeme).toBe(")");
        expect(actual[3].lexeme).toBe("*");
        expect(actual[4].lexeme).toBe("(");
        expect(actual[5].lexeme).toBe("%");
        expect(actual[6].lexeme).toBe("(");
        expect(actual[7].lexeme).toBe("(");
        expect(actual[8].lexeme).toBe("+");
        expect(actual[9].lexeme).toBe(")");
        expect(actual[10].lexeme).toBe("-");
        expect(actual[11].lexeme).toBe(")");
        expect(actual[12].lexeme).toBe(")");
    });

    it("considers brackets as unknown category in ICWS'88 standard",() => {

        var document = "MOV (5 + 4)*3\nlabel EQU (4 % ((3 + 2) - 1))";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, _.defaults({ standard: Standard.ICWS88 }, Parser.DefaultOptions)).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Maths });

        expect(actual.length).toBe(3);

        expect(actual[0].lexeme).toBe("+");
        expect(actual[1].lexeme).toBe("+");
        expect(actual[2].lexeme).toBe("-");

        var unknown = _(tokens).where({ category: TokenCategory.Unknown });

        expect(unknown.length).toBe(7);
        expect(unknown[0].lexeme).toBe("(5");
        expect(unknown[1].lexeme).toBe(")*3");
        expect(unknown[2].lexeme).toBe("(4");
        expect(unknown[3].lexeme).toBe("%");
        expect(unknown[4].lexeme).toBe("((3");
        expect(unknown[5].lexeme).toBe(")");
        expect(unknown[6].lexeme).toBe("))");
    });

    it("considers brackets as unknown category in ICWS'86 standard",() => {

        var document = "MOV (5 + 4)*3\nlabel EQU (4 % ((3 + 2) - 1))";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions)).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Maths });

        expect(actual.length).toBe(3);

        expect(actual[0].lexeme).toBe("+");
        expect(actual[1].lexeme).toBe("+");
        expect(actual[2].lexeme).toBe("-");

        var unknown = _(tokens).where({ category: TokenCategory.Unknown });

        expect(unknown.length).toBe(7);
        expect(unknown[0].lexeme).toBe("(5");
        expect(unknown[1].lexeme).toBe(")*3");
        expect(unknown[2].lexeme).toBe("(4");
        expect(unknown[3].lexeme).toBe("%");
        expect(unknown[4].lexeme).toBe("((3");
        expect(unknown[5].lexeme).toBe(")");
        expect(unknown[6].lexeme).toBe("))");
    });

    it("tokenises comments",() => {

        var document = "mov ; abc ; ;; mov\nmov; abc";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Comment });

        expect(actual.length).toBe(2);

        expect(actual[0].lexeme).toBe("; abc ; ;; mov");
        expect(actual[1].lexeme).toBe("; abc");
    });

    it("tokenises labels",() => {

        var document = "MOV #4, @label\nabc EQU 3\nc123 MOV.X 5, c123\nab_2_ca_123\n2xyz _y_z";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        var actual = _.where(tokens, { category: TokenCategory.Label });

        expect(actual.length).toBe(7);

        expect(actual[0].lexeme).toBe("label");
        expect(actual[1].lexeme).toBe("abc");
        expect(actual[2].lexeme).toBe("c123");
        expect(actual[3].lexeme).toBe("c123");
        expect(actual[4].lexeme).toBe("ab_2_ca_123");
        expect(actual[5].lexeme).toBe("xyz");
        expect(actual[6].lexeme).toBe("_y_z");
    });

    it("is case insensitive when tokenising opcodes, modifiers and preprocessor commands",() => {

        var document =
            "DAT MOV ADD SUB MUL DIV MOD JMP JMZ JMN DJN CMP SLT SPL ORG EQU END " +
            "dat mov add sub mul div mod jmp jmz jmn djn cmp slt spl org equ end " +
            ".AB .BA .A .B .F .X .I " +
            ".ab .ba .a .b .f .x .i";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        expect(_.where(tokens, { category: TokenCategory.Opcode }).length).toBe(28);
        expect(_.where(tokens, { category: TokenCategory.Preprocessor }).length).toBe(6);
        expect(_.where(tokens, { category: TokenCategory.Modifier }).length).toBe(14);

        expect(tokens[0].lexeme).toBe("DAT");
        expect(tokens[1].lexeme).toBe("MOV");
        expect(tokens[2].lexeme).toBe("ADD");
        expect(tokens[3].lexeme).toBe("SUB");
        expect(tokens[4].lexeme).toBe("MUL");
        expect(tokens[5].lexeme).toBe("DIV");
        expect(tokens[6].lexeme).toBe("MOD");
        expect(tokens[7].lexeme).toBe("JMP");
        expect(tokens[8].lexeme).toBe("JMZ");
        expect(tokens[9].lexeme).toBe("JMN");
        expect(tokens[10].lexeme).toBe("DJN");
        expect(tokens[11].lexeme).toBe("CMP");
        expect(tokens[12].lexeme).toBe("SLT");
        expect(tokens[13].lexeme).toBe("SPL");
        expect(tokens[14].lexeme).toBe("ORG");
        expect(tokens[15].lexeme).toBe("EQU");
        expect(tokens[16].lexeme).toBe("END");

        expect(tokens[17].lexeme).toBe("DAT");
        expect(tokens[18].lexeme).toBe("MOV");
        expect(tokens[19].lexeme).toBe("ADD");
        expect(tokens[20].lexeme).toBe("SUB");
        expect(tokens[21].lexeme).toBe("MUL");
        expect(tokens[22].lexeme).toBe("DIV");
        expect(tokens[23].lexeme).toBe("MOD");
        expect(tokens[24].lexeme).toBe("JMP");
        expect(tokens[25].lexeme).toBe("JMZ");
        expect(tokens[26].lexeme).toBe("JMN");
        expect(tokens[27].lexeme).toBe("DJN");
        expect(tokens[28].lexeme).toBe("CMP");
        expect(tokens[29].lexeme).toBe("SLT");
        expect(tokens[30].lexeme).toBe("SPL");
        expect(tokens[31].lexeme).toBe("ORG");
        expect(tokens[32].lexeme).toBe("EQU");
        expect(tokens[33].lexeme).toBe("END");

        expect(tokens[34].lexeme).toBe(".AB");
        expect(tokens[35].lexeme).toBe(".BA");
        expect(tokens[36].lexeme).toBe(".A");
        expect(tokens[37].lexeme).toBe(".B");
        expect(tokens[38].lexeme).toBe(".F");
        expect(tokens[39].lexeme).toBe(".X");
        expect(tokens[40].lexeme).toBe(".I");

        expect(tokens[41].lexeme).toBe(".AB");
        expect(tokens[42].lexeme).toBe(".BA");
        expect(tokens[43].lexeme).toBe(".A");
        expect(tokens[44].lexeme).toBe(".B");
        expect(tokens[45].lexeme).toBe(".F");
        expect(tokens[46].lexeme).toBe(".X");
        expect(tokens[47].lexeme).toBe(".I");
    });

    it("is case sensitive when tokenising labels",() => {

        var document = "lowercase UPPERCASE mIx_34_Ed";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        expect(tokens.length).toBe(4);
        expect(tokens[0].lexeme).toBe("lowercase");
        expect(tokens[1].lexeme).toBe("UPPERCASE");
        expect(tokens[2].lexeme).toBe("mIx_34_Ed");
    });

    it("stores the line and character number against each token",() => {

        var document =
            "mov.ab #4, #5\n" +
            "add @lbl, >0\n" +
            "\n" +
            " \t\n" +
            "\tlbl EQU #0";

        var scanner = new Scanner();
        var tokens = scanner.scan(document, Parser.DefaultOptions).tokens;

        var line1 = _.filter(tokens,(item: IToken) => { return item.position.line === 1; });
        var line2 = _.filter(tokens,(item: IToken) => { return item.position.line === 2; });
        var line3 = _.filter(tokens,(item: IToken) => { return item.position.line === 3; });
        var line4 = _.filter(tokens,(item: IToken) => { return item.position.line === 4; });
        var line5 = _.filter(tokens,(item: IToken) => { return item.position.line === 5; });

        expect(line1.length).toBe(8);
        expect(line1[0].position.char).toBe(1);
        expect(line1[1].position.char).toBe(4);
        expect(line1[2].position.char).toBe(8);
        expect(line1[3].position.char).toBe(9);
        expect(line1[4].position.char).toBe(10);
        expect(line1[5].position.char).toBe(12);
        expect(line1[6].position.char).toBe(13);
        expect(line1[7].position.char).toBe(14);

        expect(line2.length).toBe(7);
        expect(line2[0].position.char).toBe(1);
        expect(line2[1].position.char).toBe(5);
        expect(line2[2].position.char).toBe(6);
        expect(line2[3].position.char).toBe(9);
        expect(line2[4].position.char).toBe(11);
        expect(line2[5].position.char).toBe(12);
        expect(line2[6].position.char).toBe(13);

        expect(line3.length).toBe(1);
        expect(line3[0].position.char).toBe(1);

        expect(line4.length).toBe(1);
        expect(line4[0].position.char).toBe(3);

        expect(line5.length).toBe(5);
        expect(line5[0].position.char).toBe(2);
        expect(line5[1].position.char).toBe(6);
        expect(line5[2].position.char).toBe(10);
        expect(line5[3].position.char).toBe(11);
        expect(line5[4].position.char).toBe(12);
    });

    it("can handle an empty document",() => {

        var document = "";

        var scanner = new Scanner();
        var actual = scanner.scan(document, Parser.DefaultOptions).tokens;

        expect(actual.length).toBe(1);
        expect(actual[0].category).toBe(TokenCategory.EOL);
    });

    it("does not allow maths operators to be followed by whitespace under ICWS'88 standard",() => {

        var document = "MOV\t#label- 1";

        var pass = new Scanner();
        var actual = pass.scan(document, _.defaults({ standard: Standard.ICWS88 }, Parser.DefaultOptions));

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(6);

        expect(actual.tokens[0].lexeme).toBe("MOV");
        expect(actual.tokens[1].lexeme).toBe("#");
        expect(actual.tokens[2].lexeme).toBe("label");
        expect(actual.tokens[3].lexeme).toBe("-");
        expect(actual.tokens[4].lexeme).toBe("1");
        expect(actual.tokens[5].lexeme).toBe("\n");

        expect(actual.tokens[3].category).toBe(TokenCategory.Unknown);
    });

    it("inserts a zero before maths operators if the operator is preceded by whitespace under the ICWS'88 standard",() => {

        var document = "MOV\t#0\t-1";

        var pass = new Scanner();
        var actual = pass.scan(document, _.defaults({ standard: Standard.ICWS88 }, Parser.DefaultOptions));

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(7);

        expect(actual.tokens[0].lexeme).toBe("MOV");
        expect(actual.tokens[1].lexeme).toBe("#");
        expect(actual.tokens[2].lexeme).toBe("0");
        expect(actual.tokens[3].lexeme).toBe("0");
        expect(actual.tokens[4].lexeme).toBe("-");
        expect(actual.tokens[5].lexeme).toBe("1");
        expect(actual.tokens[6].lexeme).toBe("\n");

        expect(actual.tokens[3].category).toBe(TokenCategory.Number);
    });

    it("only recognises labels which are eight or fewer characters in length under ICWS'86 standard",() => {

        var document = "eightlet mov 0, 1\nfour mov 0, 1\ntwelveletter mov 0, 1";

        var pass = new Scanner();
        var actual = pass.scan(document, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions));

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(18);

        expect(actual.tokens[0].lexeme).toBe("eightlet");
        expect(actual.tokens[6].lexeme).toBe("four");
        expect(actual.tokens[12].lexeme).toBe("twelveletter");

        expect(actual.tokens[0].category).toBe(TokenCategory.Label);
        expect(actual.tokens[6].category).toBe(TokenCategory.Label);
        expect(actual.tokens[12].category).toBe(TokenCategory.Unknown);
    });

    it("recognises comments which are not preceeded by whitespace",() => {

        var document = "MOV $0, #0;comment";

        var scanner = new Scanner();
        var actual = scanner.scan(document, Parser.DefaultOptions);

        expect(actual.tokens.length).toBe(8);
        expect(actual.tokens[6].lexeme).toBe(";comment");
        expect(actual.tokens[6].category).toBe(TokenCategory.Comment);
    });

    it("correctly tokenises a indirect a field mode",() => {

        var document = "dat.A * 1, #1";

        var scanner = new Scanner();
        var actual = scanner.scan(document, Parser.DefaultOptions);

        expect(actual.messages.length).toBe(0);

        expect(actual.tokens.length).toBe(8);
        expect(actual.tokens[0].lexeme).toBe("DAT");
        expect(actual.tokens[1].lexeme).toBe(".A");
        expect(actual.tokens[2].lexeme).toBe("*");
        expect(actual.tokens[3].lexeme).toBe("1");
        expect(actual.tokens[4].lexeme).toBe(",");
        expect(actual.tokens[5].lexeme).toBe("#");
        expect(actual.tokens[6].lexeme).toBe("1");
        expect(actual.tokens[7].lexeme).toBe("\n");

        expect(actual.tokens[2].category).toBe(TokenCategory.Mode);
    });
});