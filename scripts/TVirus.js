///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
var Virus = /** @class */ (function () {
    function Virus() {
        this.rLetalitaet = 0.5;
        this.tRekonvaleszenz = 700;
        this.tIncubation = 500;
        this.tLatenz = 10;
        this.symptoms = {
            SNEEZING: 0.001,
            COUGHING: 0.002,
            SPONTANIOUS_EYE_BLEEDING: 0.001,
            toString: function () {
                var returnString = "";
                if (this.SNEEZING > 0.0005)
                    returnString += "    - Sneezing: " + this.SNEEZING.toFixed(4) + "\n";
                if (this.COUGHING > 0.0005)
                    returnString += "    - Coughing: " + this.COUGHING.toFixed(4) + "\n";
                if (this.SPONTANIOUS_EYE_BLEEDING > 0.0005)
                    returnString += "    - Eye: " + this.SPONTANIOUS_EYE_BLEEDING.toFixed(3) + "\n";
                return returnString;
            },
            clone: function () {
                return this;
            }
        };
    }
    Virus.prototype.isNotSimilarEnough = function (v) {
        var toleranceLetalitaet = 0.001;
        var toleranceRekonvaleszenz = 0.001;
        var toleranceIncubation = 0.001;
        var toleranceLatenz = 0.001;
        var toleranceSneezing = 0.50;
        var toleranceCoughing = 0.50;
        var toleranceSpontaniousEyeBleeding = 0.50;
        return (1 - min([this.rLetalitaet, v.rLetalitaet]) / max([this.rLetalitaet, v.rLetalitaet]) > toleranceLatenz
            || 1 - min([this.tRekonvaleszenz, v.tRekonvaleszenz]) / max([this.tRekonvaleszenz, v.tRekonvaleszenz]) > toleranceRekonvaleszenz
            || 1 - min([this.tIncubation, v.tIncubation]) / max([this.tIncubation, v.tIncubation]) > toleranceIncubation
            || 1 - min([this.tLatenz, v.tLatenz]) / max([this.tLatenz, v.tLatenz]) > toleranceLatenz
            || 1 - min([this.symptoms.COUGHING, v.symptoms.COUGHING]) / max([this.symptoms.COUGHING, v.symptoms.COUGHING]) > toleranceCoughing
            || 1 - min([this.symptoms.SNEEZING, v.symptoms.SNEEZING]) / max([this.symptoms.SNEEZING, v.symptoms.SNEEZING]) > toleranceSneezing
            || 1 - min([this.symptoms.SPONTANIOUS_EYE_BLEEDING, v.symptoms.SPONTANIOUS_EYE_BLEEDING]) / max([this.symptoms.SPONTANIOUS_EYE_BLEEDING, v.symptoms.SPONTANIOUS_EYE_BLEEDING]) > toleranceSpontaniousEyeBleeding);
    };
    //return mutated version of the Virus
    Virus.prototype.get = function () {
        var _v = new Virus();
        _v.rLetalitaet = this.rLetalitaet;
        _v.tRekonvaleszenz = this.tRekonvaleszenz * random(0.5, 1.5);
        _v.tIncubation = round(this.tIncubation * random(0.5, 1.5));
        _v.tLatenz = 300 * random(0.5, 1.5);
        _v.symptoms = {
            SNEEZING: this.symptoms.SNEEZING * random(0.5, 1.5),
            COUGHING: this.symptoms.COUGHING * random(0.5, 1.5),
            SPONTANIOUS_EYE_BLEEDING: this.symptoms.SPONTANIOUS_EYE_BLEEDING * random(0.5, 1.5),
            toString: function () {
                var returnString = "";
                if (this.SNEEZING > 0.0005)
                    returnString += "    Sneezing: " + this.SNEEZING.toFixed(4) + "\n";
                if (this.COUGHING > 0.0005)
                    returnString += "    Coughing: " + this.COUGHING.toFixed(4) + "\n";
                if (this.SPONTANIOUS_EYE_BLEEDING > 0.0005)
                    returnString += "    Eye: " + this.SPONTANIOUS_EYE_BLEEDING.toFixed(3) + "\n";
                return returnString;
            },
            clone: function () {
                return this;
            }
        };
        return _v;
    };
    return Virus;
}());
