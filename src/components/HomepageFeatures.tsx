import useBaseUrl from '@docusaurus/useBaseUrl';
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    image: '/img/undraw1.svg',
    description: (
      <>
        Concise yet expressive schema interface, equipped to model simple to complex data models
      </>
    ),
  },
  {
    title: 'Built-in async validation and Powerful TypeScript support',
    image: '/img/undraw2.svg',
    description: (
      <>
        Model server-side and client-side validation equally well.
        Infer static types from schema, or ensure schema correctly implement a type
      </>
    ),
  },
  {
    title: 'Extensible and easy debugging',
    image: '/img/undraw3.svg',
    description: (
      <>
        Add your own type-safe methods and schema. Rich error details, make debugging a breeze
      </>
    ),
  },
];

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img
          className={styles.featureSvg}
          alt={title}
          src={useBaseUrl(image)}
        />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
