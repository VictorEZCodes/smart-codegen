export const componentTemplates = {
  functional: (name) => `import React from 'react';
import styles from './${name}.module.css';

interface ${name}Props {
  /** Title of the component */
  title?: string;
  /** Optional className for styling */
  className?: string;
  /** Optional children elements */
  children?: React.ReactNode;
}

export const ${name}: React.FC<${name}Props> = ({
  title,
  className,
  children
}) => {
  return (
    <div className={\`\${styles.container} \${className || ''}\`}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default ${name};
`,

  class: (name) => `import React, { Component } from 'react';
import styles from './${name}.module.css';

interface ${name}Props {
  /** Title of the component */
  title?: string;
  /** Optional className for styling */
  className?: string;
  /** Optional children elements */
  children?: React.ReactNode;
}

interface ${name}State {
  isLoading: boolean;
  error: Error | null;
}

export class ${name} extends Component<${name}Props, ${name}State> {
  constructor(props: ${name}Props) {
    super(props);
    this.state = {
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    // Initialize component
  }

  componentWillUnmount() {
    // Cleanup
  }

  render() {
    const { title, className, children } = this.props;
    const { isLoading, error } = this.state;

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
      <div className={\`\${styles.container} \${className || ''}\`}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }
}

export default ${name};
`
};