import ComponentExample from "src/components/ComponentExample"
import ExampleSection from "src/components/ExampleSection"
import React from "react"

const Variations = () => {
    return (
        <ExampleSection title="Variations">
            <ComponentExample title="Basic Icon" examplePath="atoms/Icon/Variations/VariationsExampleSimple">
                Display a simple Icon in its default size.
            </ComponentExample>

            <ComponentExample title="Icon Sizes" examplePath="atoms/Icon/Variations/VariationsExampleSize">
                An icon can vary in size.
            </ComponentExample>
        </ExampleSection>
    )
}

export default Variations
