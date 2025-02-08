import {act, fireEvent, render, RenderResult} from "@testing-library/react";
import {Step2Form} from "./Step2Form.tsx";
import {vi} from "vitest";

afterEach(() => {
    vi.restoreAllMocks()
})

describe('step2Form', () => {
    it('renderValidValues', async () => {
        const tester = new Step2FormPageTester()
            .withName('Arturo')
            .withLastname('Volpe');
        
        let asserter = await tester.whenDoSubmit();
        await asserter.hasAllFieldsValid();
        await asserter.callbackWasCalledWith({
            firstname: 'Arturo',
            lastname: 'Volpe'
        });
    });

    it('validateEmptyFields', async () => {
        const tester = new Step2FormPageTester()
            .withName('')
            .withLastname('');
        
        let asserter = await tester.whenDoSubmit();
        await asserter.hasInvalidFieldsCount(1); // only the name is required
        await asserter.hasInvalidFirstName();
        await asserter.callbackWasNotCalled();
    });

    it('validateInvalidFields', async () => {
        const tester = new Step2FormPageTester()
            .withName('super large name that exceed the expected length')
            .withLastname('super large lastname that exceed the expected length');
        
        let asserter = await tester.whenDoSubmit();
        await asserter.hasInvalidFieldsCount(2);
        await asserter.hasInvalidFirstName();
        await asserter.callbackWasNotCalled();
    });
});

class Step2FormPageTester {

    name: String = "";
    lastname: String = "";
    component!: RenderResult;
    submitCallback: (dat: Inputs) => void = vi.fn();

    withName(name: string) { this.name = name; return this; }
    withLastname(lastname: string) { this.lastname = lastname; return this; }

    async whenDoSubmit() {
        this.component = render(<Step2Form onSubmit={this.submitCallback} />);

        await this.fillInput("firstname-input", this.name);
        await this.fillInput("lastname-input", this.lastname);

        const bttn = await this.component
                .findByText('Save');

        fireEvent.click(bttn);

        return new Step2FormPageAsserter(this.component, this.submitCallback);
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

