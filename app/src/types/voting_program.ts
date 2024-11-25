export type VotingProgram = {
  "address": "J9zEWRH1AeggcKxuXHMTuwDn1RSUXuNK3DdrPMvFTZbq",
  "metadata": {
    "name": "voting_program",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "close_box",
      "discriminator": [
        255,
        201,
        78,
        228,
        223,
        71,
        133,
        90
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "box_",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  120
                ]
              },
              {
                "kind": "arg",
                "path": "_ref_id"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "ref_id",
          "type": "string"
        }
      ]
    },
    {
      "name": "close_vote_record",
      "discriminator": [
        41,
        137,
        198,
        76,
        80,
        223,
        157,
        10
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "creator",
          "relations": [
            "box_"
          ]
        },
        {
          "name": "box_",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  120
                ]
              },
              {
                "kind": "arg",
                "path": "_ref_id"
              }
            ]
          }
        },
        {
          "name": "vote_record",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  95,
                  114,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "voter"
              },
              {
                "kind": "account",
                "path": "box_"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "ref_id",
          "type": "string"
        }
      ]
    },
    {
      "name": "downvote",
      "discriminator": [
        73,
        64,
        0,
        158,
        133,
        185,
        55,
        7
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "creator",
          "relations": [
            "box_"
          ]
        },
        {
          "name": "box_",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  120
                ]
              },
              {
                "kind": "arg",
                "path": "_ref_id"
              }
            ]
          }
        },
        {
          "name": "vote_record",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  95,
                  114,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "voter"
              },
              {
                "kind": "account",
                "path": "box_"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "ref_id",
          "type": "string"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "box_",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  120
                ]
              },
              {
                "kind": "arg",
                "path": "ref_id"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "ref_id",
          "type": "string"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "upvote",
      "discriminator": [
        197,
        8,
        144,
        51,
        126,
        41,
        156,
        81
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "creator",
          "relations": [
            "box_"
          ]
        },
        {
          "name": "box_",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  120
                ]
              },
              {
                "kind": "arg",
                "path": "_ref_id"
              }
            ]
          }
        },
        {
          "name": "vote_record",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  95,
                  114,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "voter"
              },
              {
                "kind": "account",
                "path": "box_"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "ref_id",
          "type": "string"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Box",
      "discriminator": [
        244,
        14,
        93,
        82,
        23,
        224,
        178,
        197
      ]
    },
    {
      "name": "VoteRecord",
      "discriminator": [
        112,
        9,
        123,
        165,
        234,
        9,
        157,
        167
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidCreator",
      "msg": "The creator of the box is invalid"
    },
    {
      "code": 6001,
      "name": "AlreadyVoted",
      "msg": "The user has already voted."
    },
    {
      "code": 6002,
      "name": "InvalidRefId",
      "msg": "The ref_id does not match with ref_id of the box"
    },
    {
      "code": 6003,
      "name": "UnauthorizedClose",
      "msg": "The user is not authorized to close the box"
    }
  ],
  "types": [
    {
      "name": "Box",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "ref_id",
            "type": "string"
          },
          {
            "name": "upvotes",
            "type": "u64"
          },
          {
            "name": "downvotes",
            "type": "u64"
          },
          {
            "name": "total_votes",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "VoteRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "has_voted",
            "type": "bool"
          },
          {
            "name": "vote_type",
            "type": {
              "defined": {
                "name": "VoteType"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "VoteType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Upvote"
          },
          {
            "name": "Downvote"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "SEED",
      "type": "string",
      "value": "\"hivemind\""
    }
  ]
}