﻿import { Standard } from "../../Interface/IParseOptions";
import { Expression } from "../../Expression";
import { Parser } from "../../Parser";
import { Scanner } from "../../Scanner";
import { Filter } from "../../Filter";
import { ForPass } from "../../ForPass";
import { PreprocessCollector } from "../../PreprocessCollector";
import { PreprocessAnalyser } from "../../PreprocessAnalyser";
import { PreprocessEmitter } from "../../PreprocessEmitter";
import { LabelCollector } from "../../LabelCollector";
import { LabelEmitter } from "../../LabelEmitter";
import { MathsProcessor } from "../../MathsProcessor";
import { DefaultPass } from "../../DefaultPass";
import { OrgPass } from "../../OrgPass";
import { SyntaxCheck } from "../../SyntaxCheck";
import { IllegalCommandCheck } from "../../IllegalCommandCheck";
import { LoadFileSerialiser } from "../../LoadFileSerialiser";
import { TestLoader } from "./TestLoader";
import * as _ from "underscore";

"use strict";

export class TestHelper {
    private static failedIndex(name: string, a: string, b: string) {

        for (var i = 0; i < a.length; i++) {

            var ac = a[i];
            var bc = b[i];

            if (ac !== bc) {
                console.log(name + " Failed index " + i.toString() + ", " + ac + " !== " + bc);

                var si = i - 10;
                if (si < 0) {
                    si = 0;
                }

                var ei = i + 10;
                if (ei >= a.length) {
                    ei = a.length - 1;
                }

                var msg = "";
                for (var j = si; j <= ei; j++) {
                    msg += a[j];
                }
                console.log("Back ten forward ten: " + msg);

                return;
            }
        }
    }

    public static testWarriorList(path: string, names: string[], standard: Standard, allowMessages: boolean = false) {

        var loader = new TestLoader();
        loader.getWarriors(path, names).then((warriors) => {

            _(warriors).forEach((warrior) => {

                var expression = new Expression();

                var parser = new Parser(
                    new Scanner(),
                    new Filter(),
                    new ForPass(expression),
                    new PreprocessCollector(),
                    new PreprocessAnalyser(),
                    new PreprocessEmitter(),
                    new LabelCollector(),
                    new LabelEmitter(),
                    new MathsProcessor(expression),
                    new DefaultPass(),
                    new OrgPass(),
                    new SyntaxCheck(),
                    new IllegalCommandCheck());

                var result = parser.parse(warrior.redcode, _.defaults({
                    standard: standard
                }, Parser.DefaultOptions));

                var serialiser = new LoadFileSerialiser();

                var loadfile = serialiser.serialise(result.tokens);

                var actual = loadfile.trim();
                var expected = warrior.loadfile.replace(/[\r]/g, "").trim();

                if (actual !== expected) {
                    this.failedIndex(warrior.name, actual, expected);
                }

                expect(actual).toBe(expected);

                if (!allowMessages) {
                    expect(result.messages.length).toBe(0);
                }
            });
        });
    }
}