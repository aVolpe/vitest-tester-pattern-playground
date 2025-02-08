import {act, fireEvent, render, RenderResult} from "@testing-library/react";
import {HelloWorld} from "./HelloWorld.tsx";

describe('simpleComponent', () => {
    it('renderAndUpdateGreeting', async () => {
        const tester = new HelloWorldPageTester()
                           .withName('Arturo');
        
        let asserter = await tester.whenRender();
        await asserter.hasText("Hello Arturo");

        tester.withName('Volpe');
        asserter = await tester.whenRerender();
        await asserter.hasText("Hello Volpe");
    });
});

class HelloWorldPageTester {

    name: String = "";
    component!: RenderResult;

    withName(name: string) { this.name = name; return this; }

    whenRender() {
        this.component = render(<HelloWorld name={this.name} />);
        return new HelloWorldPageAsserter(this.component);
    }

    whenRerender() {
        this.component.rerender(<HelloWorld name={this.name} />);
        return new HelloWorldPageAsserter(this.component);
    }
}

class HelloWorldPageAsserter {
    constructor(private component: RenderResult) {}

    async hasText(expectedText: string) {
        await this.component.findByText(expectedText);
        return this;
    }
}
