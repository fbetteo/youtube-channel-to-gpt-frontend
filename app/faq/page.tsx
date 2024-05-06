import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Heading, Container } from '@chakra-ui/react';
import BackHomeButton from '../components/BackHomeButton';

const Faq = () => {
    return (
        <Container maxW="container.md" py={10}>
            <Heading as="h1" mb={6} textAlign="center">
                Frequently Asked Questions
            </Heading>
            <Accordion allowMultiple>
                {/* General Questions */}
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                What's the purpose of this website?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        You can talk and ask questions using AI to different Youtube Channels regarding the content of the videos. Even more you can keep multiple conversations with different channels at the same time.
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                What are common use cases?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        We encourage you to be creative but some users use this website to:
                        <br />
                        <ul>
                            <li> * summarise content of videos</li>
                            <li> * ask for specific content that they don't remember where it was mentioned</li>
                            <li> * talk to the channel as if they were talking to the owner for entertainment</li>
                            <li> * etc. </li>
                        </ul>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                What languages are supported?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        Currently it only works for english speaking channels. We are working on adding more languages.
                        However, you can ask in any language.
                    </AccordionPanel>
                </AccordionItem>

                {/* Billing Questions */}
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                How does the subscription work?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        Currently we offer a monthly plan that allows you to engage with 5 channels and send up to 100 messages. We are working on adding more plans based on user feedback.
                        If you need more channels feel free to reach out and we can discuss your necessities.
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                Do I need to bring my own key?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        No, we handle all on our end.
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                Is my information secure?
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        We don't store any message, we only store your basic data and the channels you picked. Authentication is handle by a third party service, we don't have access to your password neither.
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

            <BackHomeButton mt={14} />
        </Container>
    );
};

export default Faq;
