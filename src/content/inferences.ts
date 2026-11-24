/**
 * "What does this clue tell you?" For each clue a player may show as proof, four thoughts the player can have
 * about it: one that the clue really supports (always id "a" here, shuffled on screen), and three that go too far,
 * point the wrong way or ignore the clue. Whatson explains the wrong ones without giving the conclusion away.
 * The wording of every card is in plain English for ages 11 to 14.
 */

export interface InferenceCard {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  /** Only the supported thought has no `why`. */
  why?: string;
}

export interface ClueInference {
  /** First card is the supported one. */
  cards: [InferenceCard, InferenceCard, InferenceCard, InferenceCard];
  /** What Whatson says when the supported thought is chosen. */
  right: string;
}

const set = (
  right: string,
  good: string,
  wrong: [string, string][],
): ClueInference => ({
  right,
  cards: [
    { id: 'a', text: good },
    { id: 'b', text: wrong[0][0], why: wrong[0][1] },
    { id: 'c', text: wrong[1][0], why: wrong[1][1] },
    { id: 'd', text: wrong[2][0], why: wrong[2][1] },
  ],
});

export const inferences: Record<string, ClueInference> = {
  // ── What the sick and the healthy families eat ──
  'SQ-06': set(
    'Exactly. The healthy family is the one that hardly eats fish. Put it next to the families that eat fish every day.',
    'The healthy family is the one that hardly eats fish.',
    [
      ['Eating chicken protects people from the illness.', 'The clue says what they eat, not that chicken protects anyone. Compare it with what the sick families eat.'],
      ['João is lying about what his family eats.', 'Nothing in the clue says he is lying. An accusation is not a conclusion.'],
      ['Rice and beans cost less than fish.', 'That may be true, but it does not tell you anything about the illness.'],
    ],
  ),
  'ECO-04': set(
    'Yes. The sick family is the one that eats fish nearly every day. Compare it with João, who works on the same shift.',
    'The family that eats fish nearly every day is the one that is sick.',
    [
      ['Working at Tucano made the Costa family sick.', 'João works at Tucano too, and his family is healthy. What is different between the two families?'],
      ['Fishing off the rocks at weekends is dangerous.', 'The clue is about what the family eats, not about the fishing itself.'],
      ['The Costas save money by catching their own fish.', 'That may be true, but it says nothing about the illness.'],
    ],
  ),
  'RES-01': set(
    'Right. The family that eats local fish all the time is the one with sick people at home.',
    'This family eats local fish all the time, and it is the family with sick people.',
    [
      ['Cooking fish is what makes it dangerous.', 'The clue says what the family eats, not how it is cooked.'],
      ['Every family in town eats like the Silvas.', 'The clue is about one family. Other families eat differently.'],
      ['Fish is cheap in Vila do Sol.', 'That is not what the clue shows, and it does not explain the illness.'],
    ],
  ),
  'HAR-03': set(
    "Yes. Maria's family eats from the bay nearly every day, and her family is the one affected.",
    "Maria's family eats the bay's fish nearly every day and is affected.",
    [
      ['Fishing for a living makes people sick.', "Look at the Costas: they work at the factory and they are sick, too. It is what they eat, not what they do for a living."],
      ['Maria is exaggerating her family\'s illness.', 'Nothing in the clue says that. Do not assume someone is lying.'],
      ['Maria sells more fish than anyone in town.', 'The clue says nothing about how much she sells.'],
    ],
  ),
  'SQ-05': set(
    'Right. A person can work at the factory every day and be perfectly healthy. So the job is not what separates the sick from the healthy.',
    'A family can work at the factory and be perfectly healthy.',
    [
      ['The factory cannot be causing the illness.', 'One healthy family does not clear the factory. The question is how the metal could get from the factory to people.'],
      ['João was just lucky.', 'Luck is not a conclusion. Look for what João and the sick families do differently.'],
      ['João earns more than other workers.', 'Nothing in the clue says that.'],
    ],
  ),

  // ── Not contagious; the illness travels with the fish ──
  'CLI-02': set(
    'Exactly. People who look after the sick do not catch it, so it does not pass from person to person.',
    'Those who care for the sick stay well, so it does not pass from person to person.',
    [
      ['Nobody could ever catch it.', 'The clue shows it does not pass from person to person. That is different from nobody ever getting it.'],
      ['The nurses are protected by their gloves and masks.', 'The clue does not say that. In some homes, the person nursing the patient is not a nurse at all.'],
      ['Dr. Ana works very long hours.', 'That may be true, but it does not tell you anything about how the illness spreads.'],
    ],
  ),
  'MKT-04': set(
    'Yes. Families who have never been to Vila do Sol are sick too. The illness travels with the fish, not with the people.',
    'The sick families in Porto Azul never visited Vila do Sol, so the illness travels with the fish, not with people.',
    [
      ["Porto Azul's own water is poisoned too.", 'There is no clue about the water in Porto Azul. What do the two families have in common with Vila do Sol?'],
      ['The truck driver carried the illness.', 'Nothing in the clue says that, and a driver would not explain why those families are sick.'],
      ['Vila do Sol sells half of its catch.', 'That is a fact in the clue, but it does not say what happened to the people who ate it.'],
    ],
  ),

  // ── Time: the cats and the rats ──
  'MKT-05': set(
    'Right. Half the cats were already gone before the rats multiplied. The rats came after, so they cannot be the cause.',
    'The cats were already gone before the rats multiplied, so the rats came after.',
    [
      ['The rats made the cats sick.', 'Look at the order of events: the cats were already gone when the rats multiplied.'],
      ['Rats always multiply after Easter.', 'The clue does not say that. It says what happened to the cats first.'],
      ['Rats walk past the stalls in daylight.', 'That is a description. The thought has to say something about the cause or the order of events.'],
    ],
  ),
  'SCI-02': set(
    'Yes. When the cats died, nothing was left to keep the rats under control, and they multiplied.',
    'If the cats died, nothing was left to hunt the rats, so the rats multiplied.',
    [
      ['Rats multiply whenever people are sick.', 'The clue says nothing about people. It is about predators and prey.'],
      ['The rats are the first animals affected.', 'The clue says the opposite order: the predator is removed first.'],
      ['Predators are dangerous animals.', 'That is not what the clue is about.'],
    ],
  ),

  // ── Where the metal is ──
  'SCI-10': set(
    'Exactly. The metal is highest in the channel and fades with distance, so its source is the channel. And the samples were taken outside the factory grounds, by an independent lab.',
    'The metal is highest in the channel and fades with distance, so the source is the channel.',
    [
      ['The river and the boat yard are clean, so nothing else could ever pollute the bay.', 'They had low values in this sample. That does not prove they are clean forever, and the clue does not claim it.'],
      ['The mud is equally dirty everywhere.', 'Look at the numbers: they fall as you get away from the channel.'],
      ['The Science Center has good equipment.', 'That may be true, but it does not tell you where the metal comes from.'],
    ],
  ),
  'SCI-09': set(
    'Yes. The same metal is in the nerves of the cat and the fish. And the symptoms of the cats and of the people are nervous-system symptoms.',
    'The same metal is found in the nerves of the cat and the fish, the part the symptoms attack.',
    [
      ['The fish are poisonous for everyone, always.', 'The clue is about the affected fish and the cat. It does not say all fish are dangerous.'],
      ['The cat was already sick before it ate anything.', 'The clue does not say that. It says what was found in its body.'],
      ['The laboratory is too far from town to be trusted.', 'Distance does not make a result less reliable.'],
    ],
  ),
  'HAR-05': set(
    'Right. The strangest fish are by the north point, where the channel meets the bay.',
    'The strange fish are mostly near the north point, where the channel is.',
    [
      ['The north point is simply a worse place for fish.', 'It used to be Maria\'s best spot. Something changed there.'],
      ['The channel water is visibly dirty.', 'The channel water looks clear. That is why it needs to be measured.'],
      ['Maria likes fishing at the north point.', 'That is not what the clue shows.'],
    ],
  ),

  // ── The factory ──
  'TUC-03': set(
    "Yes. The factory has a direct way to put things into the bay: the channel.",
    "The factory's wastewater has a direct route into the bay: the channel.",
    [
      ['The factory pours poison into the bay on purpose.', 'The clue shows a route, not a purpose. Do not assume intentions.'],
      ['The solid waste in the landfill is making people sick.', 'The landfill is not connected to the bay or the fish.'],
      ['The plant is on a hill.', 'That is a detail, not an inference.'],
    ],
  ),
  'TUC-08': set(
    'Right. The factory uses heavy metal in its process, so it has the very substance that could be released.',
    'The factory uses heavy metal, so it has the substance that could be released.',
    [
      ['Using chemicals proves Tucano caused the illness.', 'Having the substance is not the same as proving it got out. Combine this clue with the samples.'],
      ['Every chemical is a poison.', 'The clue is about one kind of substance: heavy metal.'],
      ['Workers at the plant wear boots.', 'True, but it says nothing about where the metal goes.'],
    ],
  ),
  'TUC-02': set(
    "Exactly. The company tested its own water, so its report weighs less than an independent one. That doesn't mean it is false.",
    'The company tested its own water, so the report is less independent.',
    [
      ['The report is false.', 'It may be accurate. Be careful about a source without assuming it is lying.'],
      ['A real laboratory can always be trusted.', 'A real laboratory can still belong to the company being investigated.'],
      ['The report has an official-looking stamp.', 'A stamp does not tell you who collected the sample.'],
    ],
  ),

  // ── Other places to look, and opinions ──
  'CLI-06': set(
    'Right. The sick live near the harbor, not near the factory. Being close to the factory is not the cause.',
    'The sick live near the harbor, not near the factory, so it is not about being close to the factory.',
    [
      ['The factory has nothing to do with it.', 'Where people live does not clear the factory. The metal could reach people another way.'],
      ['The harbor air is bad.', 'The clue does not mention the air.'],
      ['Few people live on the hill.', 'That is a detail. Think about what the harbor families have in common.'],
    ],
  ),
  'HAR-08': set(
    "Yes. The red tide was short and far outside the bay, so it can't explain months of sick animals inside the bay.",
    'The red tide was short and far outside the bay, so it cannot explain animals that kept getting sick.',
    [
      ['Algae never harm fish.', 'Algae can harm fish. The point is the timing and the place.'],
      ['The red tide made the cats sick.', 'The log says it lasted two days, outside the bay.'],
      ['January was warm.', 'That is true but it is not a conclusion about the cause.'],
    ],
  ),
  'SQ-03': set(
    'Good thinking. People blame the rats because they can see them, but a headline is not a measurement.',
    'People blame the rats because they see them. A headline is not a measurement.',
    [
      ['The rats are the cause because so many people say so.', 'How many people say it does not make it true. What did anyone measure?'],
      ['Newspapers never tell the truth.', 'That goes too far. The point is the difference between what people say and what is measured.'],
      ['The headline is in big letters.', 'That is a detail and tells you nothing about the illness.'],
    ],
  ),
};

/** The clues that have thoughts to choose from, in no particular order. */
export const cluesWithInferences = Object.keys(inferences);
