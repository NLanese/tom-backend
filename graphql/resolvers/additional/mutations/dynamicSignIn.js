import db from "../../../../utils/generatePrisma.js";
import bcrypt from "bcryptjs";
import { UserInputError } from 'apollo-server-errors';
import { validateLoginInput } from "../../../../utils/validators.js";
import generateOwnerToken from "../../../../utils/generateToken/generateOwnerToken.js"
import generateManagerToken from "../../../../utils/generateToken/generateManagerToken.js";

export default {
    Mutation: {
        dynamicSignIn: async (_, { email, password }, { req }) => {
            const { errors, valid } = validateLoginInput(email, password)
    
            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }
    
            email = await email.toUpperCase()

                const foundOwner = await db.owner.findUnique({
                    where: {
                        email
                    },
                    include: {
                        drivers: {
                            include: {
                                accidents: {
                                    include: {
                                        injuryAccidents: true,
                                        propertyAccidents: true,
                                        collisionAccidents: true,
                                        selfInjuryAccidents: true
                                    }
                                },
                                weeklyReport: true,
                            }
                        },
                        managers: true,
                        dsp: {
                            include: {
                                owner: true,
                                notifiedMessages: true,
                                announcementMessages: true,
                                devices: {
                                    orderBy: {
                                        deviceIndex: 'asc'
                                    }
                                },
                            }
                        },
                        messages: true,
                        chatrooms: {
                            include: {
                                messages: true,
                                drivers: true,
                            }
                        }
                    }
                })
           

                const foundManager = await db.manager.findUnique({
                    where: {
                        email
                    },
                    include: {
                        drivers: true,
                        dsp: {
                            include: {
                                owner: true,
                                notifiedMessages: true,
                                announcementMessages: true,
                                devices: {
                                    orderBy: {
                                        deviceIndex: 'asc'
                                    }
                                },
                            }
                        },
                        owner: true,
                        messages: true,
                        chatrooms: {
                            include: {
                                messages: true,
                                drivers: true,
                            }
                        }
                    }
                })

            if (!foundOwner && !foundManager) {
                errors.general = 'Account not found';
                throw new UserInputError('Incorrect Email', {
                    errors
                });
            }

            if (foundOwner) {
                const isValid = await bcrypt.compare(password, foundOwner.password)
    
                if (!isValid) {
                    errors.general = 'Incorrect Password'
                    throw new UserInputError('Incorrect Password', {
                        errors
                    })
                }

                const token = await generateOwnerToken(foundOwner.id)

                req.session = {
                    token: `Bearer ${token}`
                }

                try {
                    return await db.owner.update({
                        where: {
                            id: foundOwner.id
                        },
                        data: {
                            token: token
                        },
                        include: {
                            drivers: {
                                include: {
                                    accidents: {
                                        include: {
                                            injuryAccidents: true,
                                            propertyAccidents: true,
                                            collisionAccidents: true,
                                            selfInjuryAccidents: true
                                        }
                                    },
                                    weeklyReport: true,
                                }
                            },
                            managers: true,
                            dsp: {
                                include: {
                                    owner: true,
                                    notifiedMessages: true,
                                    announcementMessages: true,
                                    devices: {
                                        orderBy: {
                                            deviceIndex: 'asc'
                                        }
                                    },
                                }
                            },
                            messages: true,
                            // notifiedMessages: true,
                            chatrooms: {
                                include: {
                                    messages: true
                                }
                            }
                        }
                    })
                } catch (error) {
                    throw new Error(error)
                }
            }

            if (foundManager) {
                const isValid = await bcrypt.compare(password, foundManager.password)
    
                if (!isValid) {
                    errors.general = 'Incorrect Password'
                    throw new UserInputError('Incorrect Password', {
                        errors
                    })
                }

                const token = await generateManagerToken(foundManager.id)

                req.session = {
                    token: `Bearer ${token}`
                }

                try {
                    return await db.manager.update({
                        where: {
                            id: foundManager.id
                        },
                        data: {
                            token: token
                        },
                        include: {
                            drivers: {
                                include: {
                                    accidents: {
                                        include: {
                                            injuryAccidents: true,
                                            propertyAccidents: true,
                                            collisionAccidents: true,
                                            selfInjuryAccidents: true
                                        }
                                    },
                                    weeklyReport: true,
                                }
                            },
                            dsp: {
                                include: {
                                    owner: true,
                                    notifiedMessages: true,
                                    announcementMessages: true,
                                    devices: {
                                        orderBy: {
                                            deviceIndex: 'asc'
                                        }
                                    },
                                }
                            },
                            messages: true,
                            // notifiedMessages: true,
                            chatrooms: {
                                include: {
                                    messages: true
                                }
                            }
                        }
                    })
                } catch (error) {
                    console.log(error)
                    throw new Error(error)
                }

            }
        }
    }
}