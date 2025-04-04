import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalCloseButton, ModalFooter, useColorModeValue, List,
    ListItem, ListIcon, Box, Text, Button, Flex, Badge
} from '@chakra-ui/react';
import { InfoIcon, CheckCircleIcon, StarIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionModalContent = motion(ModalContent);

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe: () => void;
    onLearnMore: () => void;
}

const SubscriptionModal = ({ isOpen, onClose, onSubscribe, onLearnMore }: SubscriptionModalProps) => {
    const modalBackground = useColorModeValue('white', 'gray.800');
    const headerBackground = useColorModeValue('blue.50', 'blue.900');
    const footerBg = useColorModeValue('gray.50', 'gray.900');
    const footerBorderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <AnimatePresence>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    isCentered
                    size="xl"
                    motionPreset="slideInBottom"
                >
                    <ModalOverlay
                        bg="blackAlpha.300"
                        backdropFilter="blur(10px)"
                    />
                    <MotionModalContent
                        backgroundColor={modalBackground}
                        borderRadius="xl"
                        overflow="hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box bg={headerBackground} p={6}>
                            <Flex justify="space-between" align="center">
                                <ModalHeader p={0} fontSize="2xl">
                                    Upgrade to Premium
                                    <Badge ml={2} colorScheme="blue">Limited Time Offer</Badge>
                                </ModalHeader>
                                <ModalCloseButton position="relative" top={0} right={0} />
                            </Flex>
                        </Box>

                        <ModalBody py={6}>
                            <List spacing={4}>
                                {[
                                    'Access up to 3 different Youtube channels',
                                    'Send up to 100 messages per month',
                                    'Unlimited access to new features',
                                    'Direct support from our team',
                                    'Cancel anytime'
                                ].map((benefit, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: index * 0.1
                                        }}
                                    >
                                        <ListItem>
                                            <Flex align="center">
                                                <ListIcon as={StarIcon} color="blue.500" />
                                                <Text fontSize="lg">{benefit}</Text>
                                            </Flex>
                                        </ListItem>
                                    </motion.li>
                                ))}
                            </List>
                        </ModalBody>

                        <ModalFooter
                            bg={footerBg}
                            borderTop="1px"
                            borderColor={footerBorderColor}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Button
                                    colorScheme="blue"
                                    size="lg"
                                    onClick={onSubscribe}
                                    leftIcon={<CheckCircleIcon />}
                                    mr={3}
                                    as={motion.button}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Subscribe Now
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={onLearnMore}
                                    as={motion.button}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Learn More
                                </Button>
                            </motion.div>
                        </ModalFooter>
                    </MotionModalContent>
                </Modal>
            )}
        </AnimatePresence>
    );
};

export default SubscriptionModal;
