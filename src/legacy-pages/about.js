import React from 'react';
import { graphql } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/Seo"

const AboutPage = ({ location, data }) => (
  <Layout location={location} title={data.site.siteMetadata.title}>
    <SEO title="About" />
    <h1>About Me</h1>
    <p>안녕하세요 제 블로그에 오신 것을 환영합니다.</p>
  </Layout>
)

export default AboutPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
