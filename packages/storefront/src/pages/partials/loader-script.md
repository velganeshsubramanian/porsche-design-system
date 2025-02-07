# Loader Script

**Function name:** `getLoaderScript()`

When using `porsche-design-system/components-{angular|react}` our core loader gets bundled into your application.  
This impacts the loading behavior of Porsche Design System components because the code gets executed **later**, once the
framework bootstraps.

To achieve this bootstrapping **earlier** we provide a partial in all
`@porsche-design-system/components-{js|angular|react|vue}` packages which needs to be injected into the `<body>` of your
`index.html`.

## Supported options

| Option   | Description                                                                                                              | Type    | Default   |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ------- | --------- | ----------- |
| `prefix` | Prefix will be added to the component names.                                                                             | `string | string[]` | `undefined` |
| `format` | Defines the output format of the partial. By default it returns a html string, with `jsx` it returns valid jsx elements. | `'html' | jsx'`     | `'html'`    |

## Examples

Project integration differs based on the project setup.  
The following showcases the most common ways.

<PartialDocs name="getLoaderScript" :params="params"></PartialDocs>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Code extends Vue {
  public params = [
    { 
      value: ""
    },
    { 
      value: "{ prefix: 'my-prefix' }",
      comment: 'with custom prefix'
    },
    { 
      value: "{ prefix: ['my-prefix', 'another-prefix'] }",
      comment: 'with multiple custom prefixes'
    },
  ];
}
</script>
