const {saveProjection, updateEventStatus} = require("../../services/dbService");

const getAffectingEvents = async (eventWeights, time_passed) => {
  const event_affecting = [];

  for (const event in eventWeights) {
    console.log(`Event: ${event}`);
    let projections = eventWeights[event]['projection'];
    let evals = eventWeights[event]['evaluation'];

    for (const proj in projections) {
      if (projections[proj]['delay'] === 0) {
        if (projections[proj]['time'] !== 0) {
          projections[proj]['time'] -= time_passed;
        } else {
          event_affecting.push(event);
        }
      } else {
        projections[proj]['delay'] -= time_passed;
      }
    }

    await saveProjection(event, projections);
    await updateEventStatus(event, true);

    for (const eval in evals) {
      console.log(`Event: ${event}, Stock: ${eval}, Evaluation: ${evals[eval]}`);
    }
  }

  return event_affecting;
}

module.exports = {getAffectingEvents};