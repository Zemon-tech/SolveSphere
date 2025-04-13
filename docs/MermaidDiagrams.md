# Mermaid.js Diagram Integration

SolveSphere integrates Mermaid.js to provide powerful diagram and chart visualization capabilities directly within the problem-solving workflow.

## What is Mermaid?

Mermaid is a JavaScript-based diagramming and charting tool that renders Markdown-inspired text definitions to create and modify diagrams dynamically. With Mermaid, you can create various types of visualizations using a simple text-based syntax.

## Diagram Types Supported

SolveSphere supports the following Mermaid diagram types:

1. **Flowcharts**: Visualize processes and workflows
   ```
   graph TD
       A[Start] --> B{Decision?}
       B -->|Yes| C[Action 1]
       B -->|No| D[Action 2]
   ```

2. **Sequence Diagrams**: Show interactions between components over time
   ```
   sequenceDiagram
       participant U as User
       participant S as System
       U->>S: Request Data
       S->>U: Return Results
   ```

3. **Class Diagrams**: Visualize class structures and relationships
   ```
   classDiagram
       class Entity {
           +id: string
           +getData()
       }
       class RelatedEntity
       Entity <-- RelatedEntity
   ```

4. **Entity Relationship Diagrams**: Show relationships between entities
   ```
   erDiagram
       ENTITY1 ||--o{ ENTITY2 : has
       ENTITY1 {
           string id
       }
   ```

5. **State Diagrams**: Visualize state transitions
   ```
   stateDiagram-v2
       [*] --> Idle
       Idle --> Processing: Start
       Processing --> Complete: Success
   ```

6. **Gantt Charts**: Show project timelines and schedules
   ```
   gantt
       title Project Timeline
       section Planning
       Research: 2023-01-01, 10d
   ```

7. **Pie Charts**: Display distributions and proportions
   ```
   pie
       title Distribution
       "Category A": 42
       "Category B": 28
   ```

## How to Use Mermaid in SolveSphere

### AI-Generated Diagrams

The AI assistant can automatically generate Mermaid diagrams based on your conversations. When discussing a process, workflow, or any concept that would benefit from visualization, the AI will often include a Mermaid diagram in its response.

Example prompts:
- "Create a flowchart for the user authentication process"
- "Can you show a sequence diagram for API communication"
- "I need a diagram of the database entity relationships"

### Manual Diagram Creation

You can also create your own diagrams using the built-in Mermaid editor:

1. Navigate to the Resources tab
2. Click the "Create Diagram" button
3. Select a diagram type from the dropdown to load a template
4. Edit the Mermaid syntax in the editor
5. Preview your changes in real-time
6. Click "Create Diagram" to save it to your accumulated content

### Mermaid Syntax Basics

Each diagram type has its own syntax. Here are some basic examples:

#### Flowchart
```
graph TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

#### Sequence Diagram
```
sequenceDiagram
    participant A as Component A
    participant B as Component B
    A->>B: Request
    B->>A: Response
```

#### Class Diagram
```
classDiagram
    class Animal {
        +name: string
        +makeSound()
    }
    class Dog {
        +breed: string
        +fetch()
    }
    Animal <|-- Dog
```

For comprehensive syntax documentation, visit the [Mermaid.js documentation](https://mermaid.js.org/syntax/flowchart.html).

## Tips for Effective Diagrams

1. **Keep It Simple**: Focus on the key elements and relationships
2. **Use Clear Labels**: Make sure node and edge labels are descriptive
3. **Organize Layout**: Use direction indicators (TD, LR, etc.) for better readability
4. **Add Comments**: Use comments in your Mermaid code for complex diagrams
5. **Use Colors**: Add styling to highlight important elements

## Keyboard Shortcuts in Diagram Editor

- `Ctrl+Space`: Auto-format code
- `Ctrl+/`: Toggle comment
- `Tab`: Indent selected lines
- `Shift+Tab`: Unindent selected lines

## Exporting Diagrams

Diagrams in your accumulated content can be:

1. Saved as part of your solution
2. Downloaded as PNG images
3. Copied directly as Mermaid code to use elsewhere

## Technical Details

- Diagrams are rendered client-side using Mermaid.js
- SolveSphere uses Mermaid version 10.x
- Diagrams are stored as text in the content database
- The diagram editor includes real-time validation and error checking 