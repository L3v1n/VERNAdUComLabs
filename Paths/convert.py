import os

def convert_and_save(data, filename):
  """Converts a list of coordinate pairs to a formatted string and saves it to a text file.

  Args:
    data: A list of coordinate pairs, where each pair is a list of two integers.
    filename: The desired name for the output text file.
  """

  converted_data = []
  for i, pair in enumerate(data):
    formatted_pair = f"{{ x: {pair[0]}, y: {pair[1]} }}"
    if i < len(data) - 1:
      formatted_pair += ","
    converted_data.append(formatted_pair)

  output_string = "\n".join(converted_data)

  # Handle potential file overwrites
  base_filename, ext = os.path.splitext(filename)
  counter = 1
  while os.path.exists(filename):
    filename = f"{base_filename}_{counter}{ext}"
    counter += 1

  with open(filename, "w") as file:
    file.write(output_string)

# Example usage:
input_data = [
]  # Multiple coordinate pairs
output_filename = "coordinates.txt"
convert_and_save(input_data, output_filename)
