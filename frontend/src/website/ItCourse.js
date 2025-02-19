import React from "react";
import Faq from "./Faq";
import Brad from "./Brad";
import Web from "./Web";
import Product from "./Product";
import Featurs from "./Featurs";
import Defin from "./Defin";
import WebDesgin from "./WebDesgin";
import ContactUs from "./ContactUs";
import { useParams } from "react-router-dom";
import {
  WebDesigning,
  FullStack,
  Graphic,
  DataScience,
  UiUx,
  DigitalMarketing,
  Python,
  MachineLearning,
  DeepLearning,
  ArtificialIntelligence,
  EthicalHacker,
  MobileApplication,
} from "./DynamicData";
const ItCourse = () => {
  const { name } = useParams();
  const indexing = {
    WebDesgin: WebDesigning,
    FullStack: FullStack,
    Graphic: Graphic,
    DataScience: DataScience,
    UiUx: UiUx,
    DigitalMarketing: DigitalMarketing,
    Python: Python,
    MachineLearning: MachineLearning,
    DeepLearning: DeepLearning,
    ArtificialIntelligence: ArtificialIntelligence,
    EthicalHacker: EthicalHacker,
    MobileApplication: MobileApplication,
  };
  return (
    <>
      <Brad />
      <WebDesgin data={indexing[name]} />
      <Product />
      <Web data={indexing[name]} />
      <Featurs data={indexing[name]} />
      <Defin data={indexing[name]} />
      <Faq data={indexing[name]} />
    </>
  );
};

export default ItCourse;
