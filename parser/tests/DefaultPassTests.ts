﻿
import { IToken, TokenCategory } from "../Interface/IToken";
import { DefaultPass } from "../DefaultPass";
import { Parser } from "../Parser";
import { Context } from "../Context";
import { TestHelper } from "./TestHelper";
import { Standard } from "../Interface/IParseOptions";
import * as _ from "underscore";
"use strict";

describe("DefaultPass",() => {

    it("Does not modify comments and fully qualified instructions",() => {

        var tokens: IToken[] = [
            {
                category: TokenCategory.Opcode,
                lexeme: "MOV",
                position: { line: 1, char: 1 }
            }, {
                category: TokenCategory.Modifier,
                lexeme: ".AB",
                position: { line: 1, char: 2 }
            }, {
                category: TokenCategory.Mode,
                lexeme: "#",
                position: { line: 1, char: 3 }
            }, {
                category: TokenCategory.Number,
                lexeme: "8",
                position: { line: 1, char: 4 }
            }, {
                category: TokenCategory.Comma,
                lexeme: ",",
                position: { line: 1, char: 5 }
            }, {
                category: TokenCategory.Mode,
                lexeme: "@",
                position: { line: 1, char: 6 }
            }, {
                category: TokenCategory.Number,
                lexeme: "34",
                position: { line: 1, char: 7 }
            }, {
                category: TokenCategory.Comment,
                lexeme: "; sdaflkj dsj kflaj fisfsd a",
                position: { line: 1, char: 8 }
            }, {
                category: TokenCategory.EOL,
                lexeme: "\n",
                position: { line: 1, char: 8 }
            },

            {
                category: TokenCategory.Comment,
                lexeme: "; dalfja ds fdkl k  a",
                position: { line: 2, char: 1 }
            }, {
                category: TokenCategory.EOL,
                lexeme: "\n",
                position: { line: 2, char: 2 }
            }
        ];

        var context = new Context();
        context.tokens = tokens.slice();

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(11);

        for (var i = 0; i < actual.tokens.length; i++) {
            expect(actual.tokens[i].category).toBe(tokens[i].category);
            expect(actual.tokens[i].lexeme).toBe(tokens[i].lexeme);
            expect(actual.tokens[i].position).toEqual(tokens[i].position);
        }
    });

    it("Defaults missing A and B operand modes to $",() => {

        var tokens: IToken[] = TestHelper.instruction(1, "", "MOV", ".AB", "", "8", ",", "", "34", "; sdaflkj dsj kflaj fisfsd a");

        var context = new Context();
        context.tokens = tokens.slice();

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(9);

        expect(actual.tokens[2].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[2].lexeme).toBe("$");
        expect(actual.tokens[2].position).toEqual({ line: 1, char: 4 });

        expect(actual.tokens[5].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[5].lexeme).toBe("$");
        expect(actual.tokens[5].position).toEqual({ line: 1, char: 7 });
    });

    it("Defaults missing A and B operand modes for DAT instructions to $",() => {

        var tokens: IToken[] = TestHelper.instruction(1, "", "MOV", ".AB", "", "8", ",", "", "34", "; sdaflkj dsj kflaj fisfsd a");

        var context = new Context();
        context.tokens = tokens.slice();

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(9);

        expect(actual.tokens[2].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[2].lexeme).toBe("$");
        expect(actual.tokens[2].position).toEqual({ line: 1, char: 4 });

        expect(actual.tokens[5].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[5].lexeme).toBe("$");
        expect(actual.tokens[5].position).toEqual({ line: 1, char: 7 });
    });

    it("Defaults the mode to # for DAT instructions under ICWS'88 standard",() => {

        var tokens: IToken[] = TestHelper.instruction(1, "", "DAT", ".AB", "", "8", ",", "", "34", "; sdaflkj dsj kflaj fisfsd a");

        var context = new Context();
        context.tokens = tokens.slice();

        var pass = new DefaultPass();
        var actual = pass.process(context, _.defaults({ standard: Standard.ICWS88 }, Parser.DefaultOptions));

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(9);

        expect(actual.tokens[2].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[2].lexeme).toBe("#");
        expect(actual.tokens[2].position).toEqual({ line: 1, char: 4 });

        expect(actual.tokens[5].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[5].lexeme).toBe("#");
        expect(actual.tokens[5].position).toEqual({ line: 1, char: 7 });
    });

    it("Defaults the mode to # for DAT instructions under ICWS'86 standard",() => {

        var tokens: IToken[] = TestHelper.instruction(1, "", "DAT", ".AB", "", "8", ",", "", "34", "; sdaflkj dsj kflaj fisfsd a");

        var context = new Context();
        context.tokens = tokens.slice();

        var pass = new DefaultPass();
        var actual = pass.process(context, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions));

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(9);

        expect(actual.tokens[2].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[2].lexeme).toBe("#");
        expect(actual.tokens[2].position).toEqual({ line: 1, char: 4 });

        expect(actual.tokens[5].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[5].lexeme).toBe("#");
        expect(actual.tokens[5].position).toEqual({ line: 1, char: 7 });
    });

    it("Defaults missing B operand to $0 for non DAT instruction",() => {

        var tokens: IToken[] = TestHelper.instruction(1, "", "MOV", ".AB", "#", "8", "", "", "", "; sdaflkj dsj kflaj fisfsd a");

        var context = new Context();
        context.tokens = tokens.slice();

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(9);

        expect(actual.tokens[5].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[5].lexeme).toBe("$");
        expect(actual.tokens[5].position).toEqual({ line: 1, char: 8 });

        expect(actual.tokens[6].category).toBe(TokenCategory.Number);
        expect(actual.tokens[6].lexeme).toBe("0");
        expect(actual.tokens[6].position).toEqual({ line: 1, char: 8 });
    });

    it("Defaults missing A operand to #0 for DAT instructions",() => {

        var tokens: IToken[] = TestHelper.instruction(1, "", "DAT", ".AB", "#", "8", "", "", "", "; sdaflkj dsj kflaj fisfsd a");

        var context = new Context();
        context.tokens = tokens.slice();

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(9);

        expect(actual.tokens[2].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[2].lexeme).toBe("#");
        expect(actual.tokens[2].position).toEqual({ line: 1, char: 3 });

        expect(actual.tokens[3].category).toBe(TokenCategory.Number);
        expect(actual.tokens[3].lexeme).toBe("0");
        expect(actual.tokens[3].position).toEqual({ line: 1, char: 4 });

        expect(actual.tokens[4].category).toBe(TokenCategory.Comma);
        expect(actual.tokens[4].lexeme).toBe(",");

        expect(actual.tokens[5].category).toBe(TokenCategory.Mode);
        expect(actual.tokens[5].lexeme).toBe("#");
        expect(actual.tokens[5].position).toEqual({ line: 1, char: 3 });

        expect(actual.tokens[6].category).toBe(TokenCategory.Number);
        expect(actual.tokens[6].lexeme).toBe("8");
        expect(actual.tokens[6].position).toEqual({ line: 1, char: 4 });
    });

    it("Does not insert missing commas",() => {

        var tokens: IToken[] = TestHelper.instruction(1, "", "MOV", ".AB", "#", "8", "", "@", "34", "; sdaflkj dsj kflaj fisfsd a");

        var context = new Context();
        context.tokens = tokens.slice();

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(8);

        expect(_(actual.tokens).where({
            category: TokenCategory.Comma
        }).length).toBe(0);
    });

    it("Inserts missing commas under ICWS'88 standard",() => {

        var tokens: IToken[] = TestHelper.instruction(1, "", "MOV", ".AB", "#", "8", "", "@", "34", "; sdaflkj dsj kflaj fisfsd a");

        var context = new Context();
        context.tokens = tokens.slice();

        var pass = new DefaultPass();
        var actual = pass.process(context, _.defaults({ standard: Standard.ICWS88 }, Parser.DefaultOptions));

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(9);

        expect(actual.tokens[4].category).toBe(TokenCategory.Comma);
        expect(actual.tokens[4].lexeme).toBe(",");
        expect(actual.tokens[4].position).toEqual({ line: 1, char: 6 });
    });

    it("Inserts missing commas under ICWS'86 standard",() => {

        var tokens: IToken[] = TestHelper.instruction(1, "", "MOV", ".AB", "#", "8", "", "@", "34", "; sdaflkj dsj kflaj fisfsd a");

        var context = new Context();
        context.tokens = tokens.slice();

        var pass = new DefaultPass();
        var actual = pass.process(context, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions));

        expect(actual.messages.length).toBe(0);
        expect(actual.tokens.length).toBe(9);

        expect(actual.tokens[4].category).toBe(TokenCategory.Comma);
        expect(actual.tokens[4].lexeme).toBe(",");
        expect(actual.tokens[4].position).toEqual({ line: 1, char: 6 });
    });

    it("Defaults the modifier to F for DAT instructions",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "DAT", "", "#", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".F");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to AB for MOV instructions with an A mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MOV", "", "#", "0", ",", "$", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to AB for CMP instructions with an A mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "CMP", "", "#", "0", ",", "$", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to AB for SEQ instructions with an A mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SEQ", "", "#", "0", ",", "$", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to AB for SNE instructions with an A mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SNE", "", "#", "0", ",", "$", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for MOV instructions with a B mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MOV", "", "$", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for CMP instructions with a B mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "CMP", "", "$", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for SEQ instructions with a B mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SEQ", "", "$", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for SNE instructions with a B mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SNE", "", "$", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to I for MOV instructions with no # mode operands",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MOV", "", "$", "0", ",", "@", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".I");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to I for CMP instructions with no # mode operands",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "CMP", "", "$", "0", ",", "@", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".I");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to I for SEQ instructions with no # mode operands",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SEQ", "", "$", "0", ",", "@", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".I");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to I for SNE instructions with no # mode operands",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SNE", "", "$", "0", ",", "@", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".I");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to AB for ADD instructions with an A mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "ADD", "", "#", "0", ",", "@", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to AB for SUB instructions with an A mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SUB", "", "#", "0", ",", "@", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to AB for MUL instructions with an A mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MUL", "", "#", "0", ",", "@", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to AB for DIV instructions with an A mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "DIV", "", "#", "0", ",", "@", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to AB for MOD instructions with an A mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MOD", "", "#", "0", ",", "@", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for ADD instructions with a B mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "ADD", "", "$", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for SUB instructions with a B mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SUB", "", "$", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for MUL instructions with a B mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MUL", "", "$", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for DIV instructions with a B mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "DIV", "", "$", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for MOD instructions with a B mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MOD", "", "$", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to F for ADD instructions with no # mode operands",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "ADD", "", "$", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".F");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to F for SUB instructions with no # mode operands",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SUB", "", "$", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".F");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to F for MUL instructions with no # mode operands",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MUL", "", "$", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".F");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to F for DIV instructions with no # mode operands",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "DIV", "", "$", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".F");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to F for MOD instructions with no # mode operands",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MOD", "", "$", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".F");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for ADD instructions with no # mode operands under ICWS'86 standard",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "ADD", "", "$", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions));

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for SUB instructions with no # mode operands under ICWS'86 standard",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SUB", "", "$", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions));

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for MUL instructions with no # mode operands under ICWS'86 standard",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MUL", "", "$", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions));

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for DIV instructions with no # mode operands under ICWS'86 standard",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "DIV", "", "$", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions));

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for MOD instructions with no # mode operands under ICWS'86 standard",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "MOD", "", "$", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, _.defaults({ standard: Standard.ICWS86 }, Parser.DefaultOptions));

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });//////////////

    it("Defaults the modifier to AB for SLT instructions with an A mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SLT", "", "#", "0", ",", ">", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for SLT instructions with a B mode of #",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SLT", "", "<", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to AB for SLT instructions where both operands use the # mode",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SLT", "", "#", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".AB");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for JMP instructions",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "JMP", "", "#", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for JMZ instructions",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "JMZ", "", "#", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for JMN instructions",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "JMN", "", "#", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for DJN instructions",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "DJN", "", "#", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for SPL instructions",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "SPL", "", "#", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });

    it("Defaults the modifier to B for NOP instructions",() => {

        var context = new Context();
        context.tokens = TestHelper.instruction(1, "", "NOP", "", "#", "0", ",", "#", "0", "");

        var pass = new DefaultPass();
        var actual = pass.process(context, Parser.DefaultOptions);

        expect(actual.tokens[1].category).toBe(TokenCategory.Modifier);
        expect(actual.tokens[1].lexeme).toBe(".B");
        expect(actual.tokens[1].position).toEqual({ line: 1, char: 1 });
    });
});
