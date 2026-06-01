import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Inicio"
      description="Documentación de sistemas internos">
      <header className={`hero hero--primary ${styles.heroBanner}`}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            Documentación de Sistemas Internos
          </Heading>
          <p className="hero__subtitle">
            Selecciona el sistema que deseas consultar
          </p>
          <div className={styles.buttons} style={{gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
            <Link
              className="button button--secondary button--lg"
              to="/procesador/intro">
              Procesador de Recetas
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/historico/intro">
              Histórico de Recetas
            </Link>
          </div>
        </div>
      </header>
    </Layout>
  );
}
