SPECIAL_CHARACTERS = r'_*[]()~`>#+-=|{}.!'

ESCAPE_SUBSTITUTION = {
    special_character: rf'\{special_character}' for special_character in SPECIAL_CHARACTERS
}

def escape_message(message: str) -> str:
  result = message
  for special_character in SPECIAL_CHARACTERS:
    result = result.replace(special_character, ESCAPE_SUBSTITUTION[special_character])
  return result
