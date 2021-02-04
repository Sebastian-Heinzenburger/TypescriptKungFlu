///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
class Virus {
    rLetalitaet: number;
    pInfection: number;
    tRekonvaleszenz: number;
    tIncubation: number;
    tLatenz: number;
    symptoms: { SNEEZING: number; COUGHING: number; SPONTANIOUS_EYE_BLEEDING: number; toString(): string;clone()};

    constructor() {
        this.rLetalitaet = 0.5;
        this.tRekonvaleszenz = 700;
        this.tIncubation = 500;
        this.tLatenz = 300;
        this.symptoms = {
            SNEEZING: 0.001,
            COUGHING: 0.002,
            SPONTANIOUS_EYE_BLEEDING: 0.001,
            toString(): string {
                let returnString = "";
                if (this.SNEEZING > 0.0005) returnString += "    - Sneezing: " + this.SNEEZING.toFixed(4) + "\n"
                if (this.COUGHING > 0.0005) returnString += "    - Coughing: " + this.COUGHING.toFixed(4) + "\n"
                if (this.SPONTANIOUS_EYE_BLEEDING > 0.0005) returnString += "    - Eye: " + this.SPONTANIOUS_EYE_BLEEDING.toFixed(3) + "\n"
                return returnString;
            },
            clone() {
                return this;
            }
        };
  }

  //return mutated version of the Virus
  get() {
      let _v = new Virus();
      _v.rLetalitaet = this.rLetalitaet;
      _v.tRekonvaleszenz = this.tRekonvaleszenz * random(0.5, 1.5);
      _v.tIncubation = round(this.tIncubation * random(0.5, 1.5));
      _v.tLatenz = 300 * random(0.5, 1.5);

      _v.symptoms = {
          SNEEZING: this.symptoms.SNEEZING * random(0.5, 1.5),
          COUGHING: this.symptoms.COUGHING * random(0.5, 1.5),
          SPONTANIOUS_EYE_BLEEDING: this.symptoms.SPONTANIOUS_EYE_BLEEDING * random(0.5, 1.5),
          toString(): string {
              let returnString = "";
              if (this.SNEEZING > 0.0005) returnString += "    Sneezing: " + this.SNEEZING.toFixed(4) + "\n"
              if (this.COUGHING > 0.0005) returnString += "    Coughing: " + this.COUGHING.toFixed(4) + "\n"
              if (this.SPONTANIOUS_EYE_BLEEDING > 0.0005) returnString += "    Eye: " + this.SPONTANIOUS_EYE_BLEEDING.toFixed(3) + "\n"
              return returnString;
          },
          clone() {
              return this;
          }
      };

      return _v;
  }
}
