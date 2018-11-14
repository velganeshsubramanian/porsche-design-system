import ComponentExample from "src/components/ComponentExample"
import ExampleSection from "src/components/ExampleSection"
import React from "react"

const Container = () => {
    return (
        <ExampleSection title="Flex Container">
            <ComponentExample title="Basic Use" examplePath="atoms/Flex/Container/FlexContainerExampleBasic">
                Use the Flex component to automatically enable a flex context for all children.
            </ComponentExample>

            <ComponentExample title="Flex Direction" examplePath="atoms/Flex/Container/FlexContainerExampleDirection">
                This establishes the main-axis, thus defining the direction flex items are placed in the flex container.
            </ComponentExample>

            <ComponentExample title="Flex Wrap" examplePath="atoms/Flex/Container/FlexContainerExampleWrap">
                By default, flex items will all try to fit onto one line. You can change that and allow the items to
                wrap as needed with this property.
            </ComponentExample>

            <ComponentExample title="Align Main Axis" examplePath="atoms/Flex/Container/FlexContainerExampleMainAxis">
                This defines the alignment along the main axis. It helps distribute extra free space left over when
                either all the flex items on a line are inflexible, or are flexible but have reached their maximum size.
                It also exerts some control over the alignment of items when they overflow the line.
            </ComponentExample>

            <ComponentExample title="Align Cross Axis" examplePath="atoms/Flex/Container/FlexContainerExampleCrossAxis">
                This defines the default behaviour for how flex items are laid out along the cross axis on the current
                line. Think of it as the main axis version for the cross axis (perpendicular to the main axis).
            </ComponentExample>

            <ComponentExample title="Align Content" examplePath="atoms/Flex/Container/FlexContainerExampleAlignContent">
                This aligns a flex containers lines within when there is extra space in the cross-axis, similar to how
                justify-content aligns individual items within the main-axis. Note: this property has no effect when
                there is only one line of flex items.
            </ComponentExample>

            <ComponentExample
                title="Child Spacing (horizontal)"
                examplePath="atoms/Flex/Container/FlexContainerExampleGap"
            >
                Use <code>gap</code> to apply equal horizontal spacing to all children of the container. You have to
                take care of vertical spacing yourself. This should not be an alternative to the global grid
                system/component.
            </ComponentExample>
        </ExampleSection>
    )
}

export default Container
