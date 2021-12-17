import db from '../../utils/generatePrisma.js';
import { UserInputError } from 'apollo-server-errors';
import {
    validateRegisterInput,
    validateLoginInput,
} from '../../utils/validators.js';
import bcrypt from 'bcryptjs';
import hashPassword from '../../utils/passwordHashing.js';
import generateSuperToken from '../../utils/generateToken/generateSuperUserToken.js';
import checkSuperAuth from '../../utils/checkAuthorization/check-super-auth.js';

export default {
    Query: {
        sGetAllAdmins: async (_, {}, context) => {
            const superUser = checkSuperAuth(context)

            try {
                return await db.admin.findMany({
                    include: {
                        users: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        sGetAdminById: async (_, {
            adminId
        }, context) => {
            const superUser = await checkSuperAuth(context)

            try {
                return await db.admin.findUnique({
                    where: {
                        id: adminId
                    },
                    include: {
                        users: {
                            include: {
                                accidents: {
                                    include: {
                                        thirdParty: true,
                                        propertyAccident: true,
                                        injuryAccident: true,
                                        injuryReport: true,
                                        hitPerson: true
                                    }
                                }
                            }
                        }
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        sGetUserById: async (_, {
            userId
        }, context) => {
            const superUser = await checkSuperAuth(context)

            try {
                return await db.user.findUnique({
                    where: {
                        id: userId
                    },
                    include: {
                        accidents: {
                            include: {
                                thirdParty: true,
                                propertyAccident: true,
                                injuryAccident: true,
                                injuryReport: true,
                                hitPerson: true
                            }
                        }
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        sGetAccidentById: async (_, {
            accidentId
        }, context) => {
            const superUser = await checkSuperAuth(context)
            try {
                return await db.accident.findUnique({
                    where: {
                        id: accidentId
                    },
                    include: {
                        thirdParty: true,
                        propertyAccident: true,
                        injuryAccident: true,
                        injuryReport: true,
                        hitPerson: true,
                        user: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    },

    Mutation: {
        sSignupSuper: async (_, {
            email,
            password,
            username,
            firstname,
            lastname,
            phoneNumber
        }, context) => {
            try {
                const {
                    valid,
                    errors
                } = validateRegisterInput(
                    username,
                    email,
                    password
                );

                email = await email.toUpperCase()
                username = await username.toUpperCase()
                firstname = await firstname.toUpperCase()
                lastname = await lastname.toUpperCase()

                if (!valid) {
                    throw new UserInputError('Errors', {
                        errors
                    })
                }

                const admin = await db.admin.findUnique({
                    where: {
                        email
                    },
                });

                if (admin) {
                    throw new UserInputError('email is taken', {
                        errors: {
                            email: 'Email is already taken',
                        },
                    });
                }

                const checkUsername = await db.admin.findUnique({
                    where: {
                        username
                    },
                });

                if (checkUsername) {
                    throw new UserInputError('username is taken', {
                        errors: {
                            email: 'Username is already taken',
                        },
                    });
                }

                password = await hashPassword(password)

                return await db.admin.create({
                    data: {
                        email: email,
                        username: username,
                        password: password,
                        firstname: firstname,
                        lastname: lastname,
                        phoneNumber: phoneNumber
                    },
                });
            } catch (error) {
                throw new Error(error)
            }
        },

        sSigninSuper: async (_, {
            email,
            password
        }, {
            req
        }) => {
            const {
                errors,
                valid
            } = validateLoginInput(email, password);

            if (!valid) {
                throw new UserInputError('Errors', {
                    errors
                })
            }

            email = await email.toUpperCase()

            const foundUser = await db.admin.findUnique({
                where: {
                    email
                }
            })

            if (!foundUser) {
                errors.general = 'User not found';
                throw new UserInputError('Incorrect Email', {
                    errors
                });
            }

            const isValid = await bcrypt.compare(password, foundUser.password)

            if (!isValid) {
                errors.general = 'Incorrect Password'
                throw new UserInputError('Incorrect Password', {
                    errors
                })
            }

            const token = await generateSuperToken(foundUser.id)

            req.session = {
                token: `Bearer ${token}`
            }

            return {
                ...foundUser,
                token: token
            }
        },

        sSuspendAdmin: async (_, {
            adminId
        }, context) => {
            const superUser = await checkSuperAuth(context)

            try {
                await db.user.updateMany({
                    where: {
                        adminId: adminId
                    },
                    data: {
                        adminAccountStanding: "Suspended"
                    }
                })
                return await db.admin.update({
                    where: {
                        id: adminId
                    },
                    data: {
                        accountStatus: "Suspended"
                    },
                    include: {
                        users: true
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        sDeleteAdmin: async (_, {
            adminId
        }, context) => {
            const superUser = await checkSuperAuth(context)

            const admin = await db.admin.findUnique({
                where: {
                    id: adminId
                },
                include: {
                    users: true
                }
            })

            await admin.users.forEach(async (user) => {
                const foundUser = await db.user.findUnique({
                    where: {
                        id: user.id
                    },
                    include: {
                        accidents: {
                            include: {
                                hitPerson: true,
                                thirdParty: true,
                                injuryAccident: true,
                                propertyAccident: true,
                                injuryReport: true
                            }
                        }
                    }
                })

                foundUser.accidents.forEach(async (accident) => {
                    const foundHitPerson = await db.hitPerson.findMany({
                        where: {
                            accidentId: accident.id
                        }
                    })

                    if (foundHitPerson.length !== 0) {
                        await db.hitPerson.deleteMany({
                            where: {
                                accidentId: accident.id
                            }
                        })
                    }

                    const foundThirdParty = await db.thirdParty.findMany({
                        where: {
                            accidentId: accident.id
                        }
                    })

                    if (foundThirdParty.length !== 0) {
                        await db.thirdParty.deleteMany({
                            where: {
                                accidentId: accident.id
                            }
                        })
                    }

                    const foundInjuryReport = await db.injuryReport.findMany({
                        where: {
                            accidentId: accident.id
                        }
                    })

                    if (foundInjuryReport.length !== 0) {
                        await db.injuryReport.deleteMany({
                            where: {
                                accidentId: accident.id
                            }
                        })
                    }

                    const foundPropertyAccident = await db.propertyAccident.findMany({
                        where: {
                            accidentId: accident.id
                        }
                    })

                    if (foundPropertyAccident.length !== 0) {
                        await db.propertyAccident.deleteMany({
                            where: {
                                accidentId: accident.id
                            }
                        })
                    }

                    const foundInjuryAccident = await db.injuryAccident.findMany({
                        where: {
                            accidentId: accident.id
                        }
                    })

                    if (foundInjuryAccident.length !== 0) {
                        await db.injuryAccident.deleteMany({
                            where: {
                                accidentId: accident.id
                            }
                        })
                    }

                    await db.accident.delete({
                        where: {
                            id: accident.id
                        }
                    })
                })

                await db.user.delete({
                    where: {
                        id: user.id
                    }
                })
            })

            try {
                return await db.admin.delete({
                    where: {
                        id: adminId
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        },

        sUpdateAdmin: async (_, {
            adminId,
            email,
            username,
            firstname,
            lastname,
            password,
            paid,
            accountStatus,
            deleted
        }, context) => {
            const superUser = await checkSuperAuth(context)

            try {
                if (typeof password !== "undefined") {
                    password = await hashPassword(password)
                }

                if (email) {
                    email = email.toUpperCase()
                }

                if (username) {
                    username = username.toUpperCase()
                }

                if (firstname) {
                    firstname = firstname.toUpperCase()
                }

                if (lastname) {
                    lastname = lastname.toUpperCase()
                }

                return await db.admin.update({
                    where: {
                        id: adminId
                    },
                    data: {
                        email: email,
                        username: username,
                        firstname: firstname,
                        lastname: lastname,
                        password: password,
                        paid: paid,
                        accountStatus: accountStatus,
                        deleted: deleted
                    }
                })
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}