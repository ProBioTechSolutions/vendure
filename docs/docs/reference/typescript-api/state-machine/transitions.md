---
title: "Transitions"
weight: 10
date: 2023-07-20T13:56:14.206Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Transitions

<GenerationInfo sourceFile="packages/core/src/common/finite-state-machine/types.ts" sourceLine="30" packageName="@vendure/core" />

A type which is used to define valid states and transitions for a state machine based
on <a href='/typescript-api/state-machine/fsm#fsm'>FSM</a>.

*Example*

```TypeScript
type LightColor = 'Green' | 'Amber' | 'Red';

const trafficLightTransitions: Transitions<LightColor> = {
  Green: {
    to: ['Amber'],
  },
  Amber: {
    to: ['Red'],
  },
  Red: {
    to: ['Green'],
  },
};
```

The `mergeStrategy` property defines how to handle the merging of states when one set of
transitions is being merged with another (as in the case of defining a {@link CustomerOrderProcess})

```ts title="Signature"
type Transitions<State extends string, Target extends string = State> = {
    [S in State]: {
        to: Readonly<Target[]>;
        mergeStrategy?: 'merge' | 'replace';
    };
}
```