import {fireEvent, render, RenderResult} from "@testing-library/react";
import {Step2Form, Inputs} from "./Step2Form";
import {afterEach, describe, it, vi, expect} from "vitest";

afterEach(() => {
    vi.restoreAllMocks()
})

describe('step2RobotForm', () => {
    it('renderValidValues', async () => {
        const tester = new Step2FormPageRobotTester();

        await tester.givenComponentRendered();
        await tester.givenFirstname('Arturo');
        await tester.givenLastname('Volpe');
        
        let asserter = await tester.whenDoSubmit();
        await asserter.hasAllFieldsValid();
    });

});

class Step2FormPageRobotTester {

    component!: RenderResult;

    async givenComponentRendered() { this.component = render(<Step2Form onSubmit={() => {}} />); }
    async givenFirstname(targetName: string) { await this.fillInput("firstname-input", targetName); }
    async givenLastname(targetName: string) { await this.fillInput("lastname-input", targetName); }

    async whenDoSubmit() {
        const bttn = await this.component.findByText('Save');
        fireEvent.click(bttn);
        return new Step2FormPageAsserter(this.component, () => {});
    }

    async fillInput(targetTestId: string, toInsert: string) {
        const input = await this.component.findByTestId(targetTestId);
        fireEvent.change(input, {target: {value: toInsert}})
        return this;
    }
}

class Step2FormPageAsserter {
    constructor(private component: RenderResult,
                private callback: (dat: Inputs) => void) {}

    async hasText(expectedText: string) {
        await this.component.findByText(expectedText);
        return this;
    }

    async hasAllFieldsValid() {
        return this.hasText('The form has 0 errors');
    }

    async hasInvalidFieldsCount(expectedCount: number) {
        return this.hasText(`The form has ${expectedCount} errors`);
    }

    async hasInvalidFirstName() {
        return this.hasText(`This field is invalid`);
    }

    async callbackWasNotCalled() {
        expect(this.callback).toHaveBeenCalledTimes(0);
        return this;
    }

    async callbackWasCalledWith(expected: Inputs) {
        expect(this.callback).toHaveBeenCalledWith(expected);
        return this;
    }
}

