import path from "path";
import { CustomGenerator } from "../types";
import { questions as defaultQuestions } from "./default";
const templatePath = path.resolve(__dirname, "../../init-template/react");
const resolveFile = (file: string): string => {
    return path.resolve(templatePath, file);
};

/**
 * Asks questions including default ones to the user used to modify generation
 * @param self Generator values
 * @param Question Contains questions
 */

export async function questions(
    self: CustomGenerator,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Question: Record<string, any>,
): Promise<void> {
    await defaultQuestions(self, Question, true, {
        devServer: true,
        htmlWebpackPlugin: true,
    });

    // Add react dependencies
    self.dependencies.push("react", "react-dom");

    // Add webpack-dev-server always
    self.dependencies.push("webpack-dev-server");

    // Add html-webpack-plugin always
    self.dependencies.push("html-webpack-plugin");

    switch (self.answers.langType) {
        case "Typescript":
            self.dependencies.push("@types/react", "@types/react-dom");
            break;
        case "ES6":
            self.dependencies.push("@babel/preset-react");
            break;
    }
}

/**
 * Handles generation of project files
 * @param self Generator values
 */
export function generate(self: CustomGenerator): void {
    const files = ["./index.html", "./src/index.png", "webpack.config.js", "package.json"];

    switch (self.answers.langType) {
        case "Typescript":
            self.answers.entry = "./src/index.tsx";
            files.push("tsconfig.json", "index.d.ts", self.answers.entry as string);
            break;
        case "ES6":
            self.answers.entry = "./src/index.js";
            files.push(self.answers.entry as string);
            break;
    }

    for (const file of files) {
        self.fs.copyTpl(
            resolveFile(file + ".tpl"),
            self.destinationPath(file as string),
            self.answers,
        );
    }
}
