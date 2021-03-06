import { assert, expect } from "chai";
import * as docx from "../../../docx";
import { Formatter } from "../../../export/formatter";
import { Numbering } from "../../../numbering";

describe("Paragraph", () => {
    let paragraph: docx.Paragraph;

    beforeEach(() => {
        paragraph = new docx.Paragraph();
    });

    describe("#constructor()", () => {

        it("should create valid JSON", () => {
            const stringifiedJson = JSON.stringify(paragraph);
            let newJson;

            try {
                newJson = JSON.parse(stringifiedJson);
            } catch (e) {
                assert.isTrue(false);
            }
            assert.isTrue(true);
        });

        it("should create have valid properties", () => {
            const stringifiedJson = JSON.stringify(paragraph);
            const newJson = JSON.parse(stringifiedJson);
            assert.equal(newJson.root[0].rootKey, "w:pPr");
        });
    });

    describe("#createTextRun", () => {
        it("should add a new run to the paragraph and return it", () => {
            const run = paragraph.createTextRun("this is a test run");
            expect(run).to.be.instanceof(docx.TextRun);
            const tree = new Formatter().format(paragraph)["w:p"];
            expect(tree).to.be.an("array").which.includes({
                "w:r": [
                    {"w:rPr": []},
                    {"w:t": ["this is a test run"]},
                ],
            });
        });
    });

    describe("#heading1()", () => {
        it("should add heading style to JSON", () => {
            paragraph.heading1();
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [
                    {
                        "w:pPr": [{"w:pStyle": [{_attr: {"w:val": "Heading1"}}]}],
                    },
                ],
            });
        });
    });

    describe("#heading2()", () => {
        it("should add heading style to JSON", () => {
            paragraph.heading2();
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [
                    {
                        "w:pPr": [{"w:pStyle": [{_attr: {"w:val": "Heading2"}}]}],
                    },
                ],
            });
        });
    });

    describe("#heading3()", () => {
        it("should add heading style to JSON", () => {
            paragraph.heading3();
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [
                    {
                        "w:pPr": [{"w:pStyle": [{_attr: {"w:val": "Heading3"}}]}],
                    },
                ],
            });
        });
    });

    describe("#title()", () => {
        it("should add title style to JSON", () => {
            paragraph.title();
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [
                    {
                        "w:pPr": [{"w:pStyle": [{_attr: {"w:val": "Title"}}]}],
                    },
                ],
            });
        });
    });

    describe("#center()", () => {
        it("should add center alignment to JSON", () => {
            paragraph.center();
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [
                    {
                        "w:pPr": [{"w:jc": [{_attr: {"w:val": "center"}}]}],
                    },
                ],
            });
        });
    });

    describe("#thematicBreak()", () => {
        it("should add thematic break to JSON", () => {
            paragraph.thematicBreak();
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [{
                    "w:pPr": [{
                        "w:pBdr": [{
                            "w:bottom": [{
                                _attr: {
                                    "w:val": "single",
                                    "w:color": "auto",
                                    "w:space": "1",
                                    "w:sz": "6",
                                },
                            }],
                        }],
                    }],
                }],
            });
        });
    });

    describe("#pageBreak()", () => {
        it("should add page break to JSON", () => {
            paragraph.pageBreak();
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [{
                    "w:pPr": [{
                        "w:r": [
                            {"w:rPr": []},
                            {"w:br": [{_attr: {"w:type": "page"}}]},
                        ],
                    }],
                }],
            });
        });
    });

    describe("#bullet()", () => {
        it("should add list paragraph style to JSON", () => {
            paragraph.bullet();
            const tree = new Formatter().format(paragraph);
            expect(tree).to.have.property("w:p").which.is.an("array").which.has.length.at.least(1);
            expect(tree["w:p"][0]).to.have.property("w:pPr").which.is.an("array").which.has.length.at.least(1);
            expect(tree["w:p"][0]["w:pPr"][0]).to.deep.equal({
                "w:pStyle": [{_attr: {"w:val": "ListParagraph"}}],
            });
        });

        it("it should add numbered properties", () => {
            paragraph.bullet();
            const tree = new Formatter().format(paragraph);
            expect(tree).to.have.property("w:p").which.is.an("array").which.has.length.at.least(1);
            expect(tree["w:p"][0]).to.have.property("w:pPr").which.is.an("array").which.has.length.at.least(2);
            expect(tree["w:p"][0]["w:pPr"][1]).to.deep.equal({
                "w:numPr": [
                    {"w:ilvl": [{_attr: {"w:val": 0}}]},
                    {"w:numId": [{_attr: {"w:val": 1}}]},
                ],
            });
        });
    });

    describe("#setNumbering", () => {
        it("should add list paragraph style to JSON", () => {
            const numbering = new Numbering();
            const numberedAbstract = numbering.createAbstractNumbering();
            numberedAbstract.createLevel(0, "lowerLetter", "%1)", "start");
            const letterNumbering = numbering.createConcreteNumbering(numberedAbstract);

            paragraph.setNumbering(letterNumbering, 0);
            const tree = new Formatter().format(paragraph);
            expect(tree).to.have.property("w:p").which.is.an("array").which.has.length.at.least(1);
            expect(tree["w:p"][0]).to.have.property("w:pPr").which.is.an("array").which.has.length.at.least(1);
            expect(tree["w:p"][0]["w:pPr"][0]).to.deep.equal({
                "w:pStyle": [{_attr: {"w:val": "ListParagraph"}}],
            });
        });

        it("it should add numbered properties", () => {
            const numbering = new Numbering();
            const numberedAbstract = numbering.createAbstractNumbering();
            numberedAbstract.createLevel(0, "lowerLetter", "%1)", "start");
            const letterNumbering = numbering.createConcreteNumbering(numberedAbstract);

            paragraph.setNumbering(letterNumbering, 0);
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [
                    {
                        "w:pPr": [
                            {"w:pStyle": [{_attr: {"w:val": "ListParagraph"}}]},
                            {
                                "w:numPr": [
                                    {"w:ilvl": [{_attr: {"w:val": 0}}]},
                                    {"w:numId": [{_attr: {"w:val": letterNumbering.id}}]},
                                ],
                            },
                        ],
                    },
                ],
            });
        });
    });

    describe("#style", () => {
        it("should set the paragraph style to the given styleId", () => {
            paragraph.style("myFancyStyle");
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [
                    {
                        "w:pPr": [
                            {"w:pStyle": [{_attr: {"w:val": "myFancyStyle"}}]},
                        ],
                    },
                ],
            });
        });
    });

    describe("#indent", () => {
        it("should set the paragraph indent to the given values", () => {
            paragraph.indent(720);
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [
                    {
                        "w:pPr": [
                            {"w:ind": [{_attr: {"w:left": 720}}]},
                        ],
                    },
                ],
            });
        });
    });

    describe("#spacing", () => {
        it("should set the paragraph spacing to the given values", () => {
            paragraph.spacing({before: 90, line: 50});
            const tree = new Formatter().format(paragraph);
            expect(tree).to.deep.equal({
                "w:p": [
                    {
                        "w:pPr": [
                            {"w:spacing": [{_attr: {"w:before": 90, "w:line": 50}}]},
                        ],
                    },
                ],
            });
        });
    });
});
